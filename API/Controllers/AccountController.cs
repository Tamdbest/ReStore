using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.Data;
using API.DTOs;
using API.Entities;
using API.Extensions;
using API.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        private readonly UserManager<User> _userManager;
        private readonly TokenService _tokenService;
        private readonly StoreContext _context;
        public AccountController(UserManager<User> userManager,TokenService tokenService,StoreContext context)
        {
            _context = context;
            _tokenService = tokenService;
            _userManager = userManager;
        }
        [HttpPost("login")]
        public async Task<ActionResult<UserDTO>> Login(LoginDTO loginDTO){
            var user=await _userManager.FindByNameAsync(loginDTO.Username);
            if(user==null||! await _userManager.CheckPasswordAsync(user,loginDTO.Password))
                return Unauthorized();
            var userBasket=await _context.Baskets.Include(s=>s.Items).ThenInclude(t=>t.Product)
                .FirstOrDefaultAsync(x=>x.BuyerId==loginDTO.Username);
            var cookieBasket=await _context.Baskets.Include(s=>s.Items).ThenInclude(t=>t.Product)
                .FirstOrDefaultAsync(x=>x.BuyerId==Request.Cookies["buyerId"]);
            if(cookieBasket!=null){
                cookieBasket.BuyerId=loginDTO.Username;
                if(userBasket!=null)
                    _context.Baskets.Remove(userBasket);
                await _context.SaveChangesAsync();
            }
            Response.Cookies.Delete("buyerId");
            return new UserDTO{
                Email=user.Email,
                Token=await _tokenService.GenerateToken(user),
                Basket=cookieBasket==null?userBasket.MapBasketToDto():cookieBasket.MapBasketToDto()
            };
        }
        [HttpPost("register")]
        public async Task<IActionResult> Register(RegisterDTO registerDTO){
            var user=new User{UserName=registerDTO.Username,Email=registerDTO.Email};
            var result=await _userManager.CreateAsync(user,registerDTO.Password);
            if(!result.Succeeded){
                foreach(var err in result.Errors){
                    ModelState.AddModelError(err.Code,err.Description);
                }
                return ValidationProblem();
            }
            await _userManager.AddToRoleAsync(user,"Member");
            return StatusCode(201);
        }
        [Authorize]
        [HttpGet("currentUser")]
        public async Task<ActionResult<UserDTO>> GetCurrentUser(){
            var user=await _userManager.FindByNameAsync(User.Identity.Name);
            var userBasket=await _context.Baskets.Include(s=>s.Items).ThenInclude(t=>t.Product)
                .FirstOrDefaultAsync(x=>x.BuyerId==user.UserName);
            var cookieBasket=await _context.Baskets.Include(s=>s.Items).ThenInclude(t=>t.Product)
                .FirstOrDefaultAsync(x=>x.BuyerId==Request.Cookies["buyerId"]);
            if(cookieBasket!=null){
                cookieBasket.BuyerId=user.UserName;
                if(userBasket!=null)
                    _context.Baskets.Remove(userBasket);
                await _context.SaveChangesAsync();
            }
            Response.Cookies.Delete("buyerId");
            return new UserDTO{
                Email=user.Email,
                Token=await _tokenService.GenerateToken(user),
                Basket=cookieBasket==null?userBasket.MapBasketToDto():cookieBasket.MapBasketToDto()
            };
        }
        [Authorize]
        [HttpGet("getAddress")]
        public async Task<ActionResult<UserAddress>> GetAddress(){
            return await _userManager.Users
                .Where(x=>x.UserName==User.Identity.Name)
                .Select(user=>user.Address)
                .FirstOrDefaultAsync();
        }
    }
}