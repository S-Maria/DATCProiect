using Azure.Messaging.ServiceBus;
using Microsoft.EntityFrameworkCore;
using ProiectDATC.Models;
using System;
using System.Text.Json;
using System.Text;
using System.Threading;
using System.Threading.Tasks;

namespace MessageQueueReceiver
{
    public class ReportMessageReceiver
    {
        private readonly AppDbContext _context;
        private readonly string _serviceBusConnectionString;
        private readonly string _queueName;

        public ReportMessageReceiver(AppDbContext context, string serviceBusConnectionString, string queueName)
        {
            _context = context;
            _serviceBusConnectionString = serviceBusConnectionString;
            _queueName = queueName;
        }

        public static async Task Main(string[] args)
        {
            // Initialize your dependencies and start the message receiver
            var options = new DbContextOptionsBuilder<AppDbContext>()
                .UseSqlServer("Server=localhost;Database=TEST;User Id=SA;Password=Administrator1;Encrypt=false;Connect Timeout=30;")  // Replace with your actual connection string
                .Options;

            var context = new AppDbContext(options);

            var serviceBusConnectionString = "Endpoint=sb://proiectdatc.servicebus.windows.net/;SharedAccessKeyName=root;SharedAccessKey=N8Rfc27yh3RzzuwPGIKAVQSP1uuV81Xbi+ASbPomOUc=;EntityPath=proiectdatc";
            var queueName = "proiectdatc";

            var cts = new CancellationTokenSource();
            var reportMessageReceiver = new ReportMessageReceiver(context, serviceBusConnectionString, queueName);
            var processingTask = reportMessageReceiver.StartReceivingAsync(cts.Token);

            try
            {
                // Allow the application to run until a key is pressed
                Console.WriteLine("Press any key to exit...");
                Console.ReadKey();
            }
            finally
            {
                // Signal cancellation to stop processing and wait for processing to complete
                cts.Cancel();
                await processingTask;
            }
        }


        public async Task StartReceivingAsync(CancellationToken cancellationToken)
        {
            await using var client = new ServiceBusClient(_serviceBusConnectionString);
            var processor = client.CreateProcessor(_queueName, new ServiceBusProcessorOptions
            {
                AutoCompleteMessages = true,
                MaxConcurrentCalls = 3
            });

            processor.ProcessMessageAsync += args => ProcessMessageAsync(args, cancellationToken);
            processor.ProcessErrorAsync += ProcessErrorAsync;

            await processor.StartProcessingAsync(cancellationToken);

            Console.WriteLine("Press any key to exit...");
            Console.ReadKey();

            var cts = new CancellationTokenSource();
            cts.Cancel();

            await processor.StopProcessingAsync();
        }

        private async Task ProcessMessageAsync(ProcessMessageEventArgs args, CancellationToken cancellationToken)
        {
            try
            {
                // Check for cancellation before processing
                cancellationToken.ThrowIfCancellationRequested();
                var message = args.Message;
                var body = message.Body.ToString();
                var reportDto = JsonSerializer.Deserialize<ReportDto>(body);

                if (reportDto == null)
                {
                    Console.WriteLine("Error: reportDto is null");
                    return;
                }

                Console.WriteLine(body);

                await SaveReportToDatabaseAsync(reportDto);

                // Complete the message to remove it from the queue
                await args.CompleteMessageAsync(message);
            }
            catch (OperationCanceledException)
            {
                // Log or handle cancellation
                Console.WriteLine("Message processing canceled.");
            }
            catch (Exception ex)
            {
                Console.WriteLine($"Error processing message: {ex}");
                // Handle other exceptions as needed
            }
        }

        private async Task ProcessErrorAsync(ProcessErrorEventArgs args)
        {
            // Handle any errors that occur.
            // You may want to add logging or other error handling mechanisms here.
            Console.WriteLine($"Error occurred: {args.Exception}");

            // Log more details if it's a Service Bus exception
            if (args.Exception is ServiceBusException serviceBusException)
            {
                Console.WriteLine($"Service Bus Exception: {serviceBusException.Reason}");
            }
        }

        private async Task SaveReportToDatabaseAsync(ReportDto reportDto)
        {
            // Convert the DTO to the entity model if needed
            var report = new Report
            {
                UserId = reportDto.UserId,
                Longitude = reportDto.Longitude,
                Latitude = reportDto.Latitude,
                Date = reportDto.Date,
                Type = reportDto.Type,
                Status = reportDto.Status
                // Add other properties as needed
            };

            // Add the report to the database
            _context.Reports.Add(report);
            await _context.SaveChangesAsync();
        }
    }
}
