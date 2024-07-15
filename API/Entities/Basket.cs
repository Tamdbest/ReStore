using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR.Protocol;

namespace API.Entities
{
    public class Basket
    {
        public int Id { get; set; }
        public string BuyerId { get; set; }
        public List<BasketItem> Items { get; set; }=new();
        public string PaymentIntentId { get; set; }
        public string ClientSecret { get; set; }
        public void AddToBasket(Product product,int quantity){
            var item=Items.FirstOrDefault(x=>x.ProductId==product.Id);
            if(item==null)
                Items.Add(new BasketItem{Quantity=quantity,Product=product});
            else
                item.Quantity+=quantity;
        }
        public void RemoveFromBasket(Product product,int quantity){
            var item=Items.FirstOrDefault(x=>x.ProductId==product.Id);
            if(item==null)
                return;
            item.Quantity-=quantity;
            if(item.Quantity==0)
                Items.Remove(item);
        }
    }
}