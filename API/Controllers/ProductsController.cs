using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json;
using System.Threading.Tasks;
using API.Data;
using API.Entities;
using API.Extensions;
using API.RequestHelpers;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController:ControllerBase
    {
        private readonly StoreContext _context;
        
        public ProductsController(StoreContext context)
        {
            _context = context;
        }   

        [HttpGet]
        public async Task<ActionResult<List<Product>>> GetProducts([FromQuery]ProductParams prodparams){
            var query=_context.Products.Sort(prodparams.OrderBy).Search(prodparams.SearchTerm)
                    .Filter(prodparams.Brands,prodparams.Types).AsQueryable();
            var products=await PagedList<Product>.GetPagedList(query,prodparams.PageNumber,prodparams.pageSize);
            Response.AddPaginationHeader(products.MetaData);
            return products;
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<Product>> GetProduct(int id){
            var product=await _context.Products.FindAsync(id);
            if(product==null)
                return NotFound();
            return product;
        }
        [HttpGet("filters")]
        public async Task<IActionResult> GetFilters(){
            var brands=await _context.Products.Select(p=>p.Brand).Distinct().ToListAsync();
            var types=await _context.Products.Select(p=>p.Type).Distinct().ToListAsync();
            return Ok(new {brands,types});
        }
    }
}