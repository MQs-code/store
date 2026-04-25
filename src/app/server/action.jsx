'use server'
import supabase from './supabase'

// 1. Manual Add Function (For Camera/Gallery uploads)
export async function addProduct(formData) {
  try {
    const file = formData.get('image'); 
    const name = formData.get('name');
    const price = formData.get('price');
    const description = formData.get('description');
    const stock = formData.get('stock') === true;
    // Barcode line yahan se remove kar di gayi hai

    if (!file) throw new Error("No image file provided");

    const fileExt = file.name.split('.').pop();
    const fileName = `${Date.now()}-${Math.floor(Math.random() * 1000)}.${fileExt}`;

    // 1. Storage Upload
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("images")
      .upload(fileName, file);

    if (uploadError) throw new Error("Storage Upload Error: " + uploadError.message);

    // 2. Get URL
    const { data: { publicUrl } } = supabase.storage
      .from("images")
      .getPublicUrl(fileName);

    // 3. Database Insert (Barcode removed from here too)
    const { data: dbData, error: dbError } = await supabase
      .from("products")
      .insert([
        { 
          name, 
          price: parseFloat(price), 
          description, 
          image_url: publicUrl ,
          stock: stock
          // Ab yahan barcode column insert nahi hoga
        }
      ]);

    if (dbError) throw new Error("Database Insert Error: " + dbError.message);

    return { success: true, message: "Product added successfully!" };
  } catch (error) {
    console.error("Server Action Error:", error.message);
    return { success: false, message: error.message };
  }
}

// 2. Excel Bulk Add Function (For Pixabay URLs)
export async function bulkAddProducts(products) {
  try {
    const { data, error } = await supabase
      .from('products')
      .insert(
        products.map((item) => ({
          name: String(item.name || "Unnamed Product"),
          price: parseFloat(item.price) || 0,
          description: String(item.description || ''),
          // FIX: Use image_url to match your manual add function 
          // and use item.image to match your client-side map
          image_url: item.image || '' 
        }))
      );

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Bulk Add Error:", error.message);
    return { success: false, error: error.message };
  }
}

// 3. Update Function
// --- SAHI EXPORT FORMAT ---
export const updateProduct = async (id, updatedData) => {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({
        name: updatedData.name,
        price: updatedData.price,
        description: updatedData.description,
        stock: updatedData.stock, // Check karein ke DB mein column 'stock' hi hy na?
      })
      .eq('id', id)
      .select(); // Naya data wapas mangwaein

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};
// 4. Delete Function
export async function deleteProduct(id, imageUrl) {
  try {
    console.log("Attempting to delete image at URL:", imageUrl);

    if (imageUrl && imageUrl.includes('storage/v1/object/public/images/')) {
      // This extraction is safer
      const fileName = decodeURIComponent(imageUrl.split('public/images/')[1]);
      
      console.log("Extracted FileName for deletion:", fileName);

      const { data, error: storageError } = await supabase
        .storage
        .from('images') 
        .remove([fileName]);

      if (storageError) {
        console.error("Supabase Storage Error:", storageError.message);
        throw new Error("Storage delete failed: " + storageError.message);
      }
      
      console.log("Storage delete response:", data);
    }

    const { error: dbError } = await supabase
      .from('products')
      .delete()
      .eq('id', id);

    if (dbError) throw dbError;

    return { success: true };
  } catch (error) {
    console.error("Final Delete Error:", error.message);
    return { success: false, message: error.message };
  }
}
// actions.jsx

export async function updateStockStatus(productId, currentStatus) {
  try {
    const { data, error } = await supabase
      .from('products')
      .update({ stock_status: currentStatus }) // Nayi value (True/False) save hogi
      .eq('id', productId); // Sirf us shoe ki ID jise change karna hy

    if (error) throw error;
    return { success: true };
  } catch (error) {
    console.error("Update failed:", error.message);
    return { success: false };
  }
}