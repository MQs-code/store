'use server'
import supabase from './supabase'

export async function addProduct(formData) {
  try {
    // FIX: 'formaData' ko 'formData' kar diya
    const file = formData.get('image'); 
    const name = formData.get('name');
    const price = formData.get('price');
    const description = formData.get('description');

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

    // 3. Database Insert
    const { data: dbData, error: dbError } = await supabase
      .from("products")
      .insert([
        { 
          name, 
          price: parseFloat(price), 
          description, 
          image_url: publicUrl 
        }
      ]);

    if (dbError) throw new Error("Database Insert Error: " + dbError.message);

    return { success: true, message: "Product added successfully!" };
  } catch (error) {
    console.error("Server Action Error:", error.message);
    return { success: false, message: error.message };
  }
}
export async function bulkAddProducts(productsArray) {
  try {
    const { data, error } = await supabase
      .from("products")
      .insert(productsArray.map(item => ({
        name: item.Name || item.name,
        price: parseFloat(item.Price || item.price),
        description: item.Description || item.description || "Luxury Collection Item",
        // Image url abhi ke liye empty ya placeholder
        image_url: "https://via.placeholder.com/600x800?text=Pending+Image"
      })));

    if (error) throw new Error(error.message);
    return { success: true, message: `${productsArray.length} products added!` };
  } catch (error) {
    return { success: false, message: error.message };
  }
}

export async function updateProduct(productId, updatedData) {
  try {
    const { error } = await supabase
      .from("products")
      .update(updatedData)
      .eq("id", productId);

    if (error) throw error;
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}
export async function deleteProduct(productId, imageUrl) {
  try {
    // 1. Storage se file delete karna
    // URL se file name nikalna (e.g., "171234567-89.jpg")
    const fileName = imageUrl.split('/').pop();
    
    const { error: storageError } = await supabase.storage
      .from("product-images")
      .remove([fileName]);

    if (storageError) console.error("Storage Delete Warning:", storageError.message);

    // 2. Database se row delete karna
    const { error: dbError } = await supabase
      .from("products")
      .delete()
      .eq("id", productId);

    if (dbError) throw dbError;

    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
}