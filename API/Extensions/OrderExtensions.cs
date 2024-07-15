using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using API.Entities.OrderAggregate;
using Microsoft.EntityFrameworkCore;

namespace API.Extensions
{
    public static class OrderExtensions
    {
        public static IQueryable<OrderDTO> ProjectOrderToOrderDTO(this IQueryable<Order> query){
            return query.Select(order=>new OrderDTO{
                Id=order.Id,
                BuyerId=order.BuyerId,
                ShippingAddress=order.ShippingAddress,
                OrderDate=order.OrderDate,
                Subtotal=order.Subtotal,
                DeliveryFee=order.DeliveryFee,
                Total=order.GetTotal(),
                OrderStatus=order.OrderStatus.ToString(),
                OrderItems=order.OrderItems.Select(item=>new OrderItemDTO{
                    ProductItemOrdered=item.ItemOrdered.ProductId,
                    Name=item.ItemOrdered.Name,
                    PictureUrl=item.ItemOrdered.PictureUrl,
                    Price=item.Price,
                    Quantity=item.Quantity
                }).ToList()
            }).AsNoTracking();
        }
    }
}