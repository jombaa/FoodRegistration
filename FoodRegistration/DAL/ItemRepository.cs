using Microsoft.EntityFrameworkCore;
using FoodRegistration.Models;

namespace FoodRegistration.DAL
{
    public class ItemRepository : IItemRepository
    {
        private readonly ItemDbContext _db;
        private readonly ILogger<ItemRepository> _logger;

        // Constructor to initialize database context and logger
        public ItemRepository(ItemDbContext db, ILogger<ItemRepository> logger)
        {
            _db = db ?? throw new ArgumentNullException(nameof(db));
            _logger = logger ?? throw new ArgumentNullException(nameof(logger));
        }

        //Retrieves all items from the databse asynchronously
        public async Task<IEnumerable<Item>?> GetAll()
        {
            try
            {
                return await _db.Items.ToListAsync();
            }
            catch (Exception e)
            {
                _logger.LogError("[ItemRepository] items ToListAsync() failed when GetAll(), error message: {e}", e.Message);
                return null;
            }
        }

        //Retrieves one specific item by its ItemID
        public async Task<Item?> GetItemById(int id)
        {
            try
            {
                return await _db.Items.FindAsync(id);
            }
            catch (Exception e)
            {
                _logger.LogError("[ItemRepository] item FindAsync(id) failed when GetItemById for ItemId {ItemId:0000}, error message: {e}", id, e.Message);
                return null;
            }
        }

        //Adds new item to the database
        public async Task<bool> Create(Item item)
        {
            try
            {
                _db.Items.Add(item);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[ItemRepository] item creation failed for item {@item}, error message: {e}", item, e.Message);
                return false;
            }
        }

        //Updates an existing item and saves the changes in the databse
        public async Task<bool> Update(Item item)
        {
            try
            {
                _db.Items.Update(item); 
                await _db.SaveChangesAsync(); 
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[ItemRepository] item update failed for ItemId {ItemId}, error message: {e}", item.ItemId, e.Message);
                return false;
            }
        }
        //Deletes an item from the database

        public async Task<bool> Delete(int id)
        {
            try
            {
                var item = await _db.Items.FindAsync(id);
                if (item == null)
                {
                    _logger.LogError("[ItemRepository] item not found for ItemId {ItemId:0000}", id);
                    return false;
                }

                _db.Items.Remove(item);
                await _db.SaveChangesAsync();
                return true;
            }
            catch (Exception e)
            {
                _logger.LogError("[ItemRepository] item deletion failed for ItemId {ItemId:0000}, error message: {e}", id, e.Message);
                return false;
            }
        }
    }
}
