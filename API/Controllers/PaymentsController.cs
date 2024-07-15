using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities.OrderAggregate;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Stripe;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class PaymentsController : ControllerBase
    {
        private readonly StoreContext _context;
        private readonly PaymentService _paymentService;
        public IConfiguration _config { get; }
        public PaymentsController(StoreContext context,PaymentService paymentService,IConfiguration config)
        {
            _config = config;
            _paymentService = paymentService;
            _context = context;
        }
        [HttpPost]
        [Authorize]
        public async Task<ActionResult<BasketDto>> CreateOrUpdatePaymentIntent(){
            var basket=await _context.Baskets
                        .FetchBasket(User.Identity.Name)
                        .FirstOrDefaultAsync();
            if(basket==null)
                return NotFound();
            var intent=await _paymentService.CreateOrUpdatePaymentIntent(basket);
            if(intent==null)
                return BadRequest(new ProblemDetails{Title="Problem creating payment intent"});
            basket.PaymentIntentId=intent.Id;
            basket.ClientSecret=intent.ClientSecret;
            _context.Update(basket);
            var result=await _context.SaveChangesAsync()>0;
            if(!result)
                return BadRequest(new ProblemDetails{Title="Problem updating payment intent"});
            return basket.MapBasketToDto();
        }
        [HttpPost("webhook")]
        public async Task<ActionResult> StripeWebhook(){
            var json=await new StreamReader(Request.Body).ReadToEndAsync();
            var stripeEvent=EventUtility
                    .ConstructEvent(json,Request.Headers["Stripe-Signature"],_config["StripeSettings:WhSecret"]);
            var charge=(Charge)stripeEvent.Data.Object;
            var order=await _context.Orders.FirstOrDefaultAsync(x=>x.PaymentIntentId==charge.PaymentIntentId);
            if(charge.Status=="succeeded")
                order.OrderStatus=OrderStatus.PaymentReceived;
            await _context.SaveChangesAsync();
            return new EmptyResult();
        }
    }
}