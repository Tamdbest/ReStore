using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;

namespace API.RequestHelpers
{
    public class PagedList<T>:List<T>
    {
        public PagedList(List<T> items,int count,int PageNumber,int pageSize)
        {
            MetaData=new MetaData{
                CurrentPage=PageNumber,
                TotalCount=count,
                PageSize=pageSize,
                TotalPages=(int)Math.Ceiling(count/(double)pageSize)
            };
            AddRange(items);
        }

        public MetaData MetaData { get; set; } 

        public static async Task<PagedList<T>> GetPagedList(IQueryable<T> query,int pageNumber,int pageSize){
            var count=await query.CountAsync();
            int maxPages=(int)Math.Ceiling(count/(double)pageSize);
            pageNumber=pageNumber<=maxPages?pageNumber:maxPages;
            var products=await query.Skip((pageNumber-1)*pageSize).Take(pageSize).ToListAsync();
            return new PagedList<T>(products,count,pageNumber,pageSize);
        }
    }
}