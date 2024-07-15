using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Entities.OrderAggregate;
using API.Extensions;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class OrdersController:ControllerBase
    {
        private readonly StoreContext _context;
        public OrdersController(StoreContext context)
        {
            _context = context;
        }
        [HttpGet]
        public async Task<ActionResult<List<OrderDTO>>> GetOrders(){
            return await _context.Orders.ProjectOrderToOrderDTO()
                .Where(x=>x.BuyerId==User.Identity.Name).ToListAsync();
        }
        [HttpGet("{id}",Name ="GetOrder")]
        public async Task<ActionResult<OrderDTO>> GetOrder(int id){
            return await _context.Orders.ProjectOrderToOrderDTO()
                .Where(x=>x.BuyerId==User.Identity.Name&&x.Id==id)
                .FirstOrDefaultAsync();
        }
        [HttpPost]
        public async Task<ActionResult<Order>> CreateOrder(CreateOrderDTO orderDTO){
            var basket=await _context.Baskets.FetchBasket(User.Identity.Name).FirstOrDefaultAsync();
            if(basket==null)
                return BadRequest(new ProblemDetails{Title="Could not find basket"});
            var items=new List<OrderItem>();
            foreach(var item in basket.Items){
                var productItem=await _context.Products.FirstOrDefaultAsync(x=>x.Id==item.ProductId);
                var productItemOrdered=new ProductItemOrdered{
                    ProductId=productItem.Id,
                    Name=productItem.Name,
                    PictureUrl=productItem.PictureUrl
                };
                var orderItem=new OrderItem{
                    ItemOrdered=productItemOrdered,
                    Price=productItem.Price,
                    Quantity=item.Quantity
                };
                items.Add(orderItem);
                productItem.QuantityInStock-=item.Quantity;
            }
            var subtotal=items.Sum(x=>x.Price*x.Quantity);
            var deliveryFee=subtotal>1000?0:500;
            var order=new Order{
                BuyerId=User.Identity.Name,
                OrderItems=items,
                ShippingAddress=orderDTO.ShippingAddress,
                Subtotal=subtotal,
                DeliveryFee=deliveryFee,
                PaymentIntentId=basket.PaymentIntentId
            };
            _context.Orders.Add(order);
            _context.Baskets.Remove(basket);
            if (orderDTO.SaveAddress){
                var user = await _context.Users.
                    Include(a => a.Address)
                    .FirstOrDefaultAsync(x => x.UserName == User.Identity.Name);

                var address = new UserAddress
                {
                    FullName = orderDTO.ShippingAddress.FullName,
                    Address1 = orderDTO.ShippingAddress.Address1,
                    Address2 = orderDTO.ShippingAddress.Address2,
                    City = orderDTO.ShippingAddress.City,
                    State = orderDTO.ShippingAddress.State,
                    Zip = orderDTO.ShippingAddress.Zip,
                    Country = orderDTO.ShippingAddress.Country
                };
                user.Address = address;
            }
            var result=await _context.SaveChangesAsync()>0;
            if(result)
                return CreatedAtRoute("GetOrder",new{id=order.Id},order.Id);
            return BadRequest(new ProblemDetails{Title="Problem creating order!"});
        }
    }
}