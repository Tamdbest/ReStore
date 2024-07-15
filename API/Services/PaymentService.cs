using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Entities;
using Stripe;

namespace API.Services
{
    public class PaymentService
    {
        private readonly IConfiguration _config;
        public PaymentService(IConfiguration config)
        {
            _config = config;
        }
        public async Task<PaymentIntent> CreateOrUpdatePaymentIntent(Basket basket){
            StripeConfiguration.ApiKey=_config["StripeSettings:SecretKey"];
            var intent=new PaymentIntent();
            var service=new PaymentIntentService();
            long total=basket.Items.Sum(x=>x.Quantity*x.Product.Price);
            long deliveryFee=total>10000?0:500;
            if(String.IsNullOrEmpty(basket.PaymentIntentId)){
                var options=new PaymentIntentCreateOptions{
                    Amount=total+deliveryFee,
                    Currency="usd",
                    PaymentMethodTypes=new List<string>{"card"}
                };
                intent=await service.CreateAsync(options);
                // basket.PaymentIntentId=intent.Id;
                // basket.ClientSecret=intent.ClientSecret;
            }
            else{
                var options=new PaymentIntentUpdateOptions{
                    Amount=total+deliveryFee
                };
                intent=await service.UpdateAsync(basket.PaymentIntentId,options);
            }
            return intent;
        }
    }
}