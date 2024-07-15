using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class BasketController:ControllerBase
    {
        private readonly StoreContext _context;
        public BasketController(StoreContext context)
        {
            _context = context;
            
        }
        [HttpGet(Name ="GetBasket")]
        public async Task<ActionResult<BasketDto>> GetBasket(){
            var basket=await RetrieveBasket(GetBuyerId());
            if(basket==null)
                return BadRequest(new ProblemDetails{Title="Basket not found!"});
            return basket.MapBasketToDto();
        }
        [HttpPost]
        public async Task<ActionResult<BasketDto>> AddItemToBasket(int productId,int quantity){
            var basket= await RetrieveBasket(GetBuyerId());
            if(basket==null)
                //return BadRequest(new ProblemDetails{Title="Basket not found!"});
                basket=CreateBasket();
            var product=await _context.Products.FirstOrDefaultAsync(x=>x.Id==productId);
            if(product==null)
                return NotFound();
            basket.AddToBasket(product,quantity);
            var res=await _context.SaveChangesAsync()>0;
            if(res)
                return CreatedAtRoute("Getbasket",MapBasketToDto(basket));
            return BadRequest(new ProblemDetails{Title="Problem saving item to basket!"});
        }
        [HttpDelete]
        public async Task<ActionResult> RemoveItemFromBasket(int productId, int quantity){
            var basket= await RetrieveBasket(GetBuyerId());
            var product=await _context.Products.FirstOrDefaultAsync(x=>x.Id==productId);
            if(basket==null||product==null)
                return NotFound();
            basket.RemoveFromBasket(product,quantity);
            var res=await _context.SaveChangesAsync()>0;
            if(res)
                return StatusCode(204);
            return BadRequest(new ProblemDetails{Title="Problem removing item from basket!"});
        }
        private Basket CreateBasket(){
            var buyerId=User.Identity.Name;
            if(buyerId==null){
                buyerId=Guid.NewGuid().ToString();
                var cookieOptions=new CookieOptions{IsEssential=true,Expires=DateTime.Now.AddDays(30)};
                Response.Cookies.Append("buyerId",buyerId,cookieOptions);
            }
            Basket basket=new Basket{BuyerId=buyerId};
            _context.Baskets.Add(basket);
            return basket;
        }
        private BasketDto MapBasketToDto(Basket basket){
            return new BasketDto
            {
                Id = basket.Id,
                BuyerId = basket.BuyerId,
                Items = basket.Items.Select(item => new BasketItemDto
                {
                    ProductId = item.ProductId,
                    Name = item.Product.Name,
                    Price = item.Product.Price,
                    PictureUrl = item.Product.PictureUrl,
                    Type = item.Product.Type,
                    Brand = item.Product.Brand,
                    Quantity = item.Quantity
                }).ToList()
            };
        }
        private async Task<Basket> RetrieveBasket(string buyerId){
            return await _context.Baskets.Include(s=>s.Items).ThenInclude(t=>t.Product)
                .FirstOrDefaultAsync(x=>x.BuyerId==buyerId);
        }
        private string GetBuyerId(){
            if(User.Identity.Name==null)
                return Request.Cookies["buyerId"];
            return User.Identity.Name;
        }
    }
}