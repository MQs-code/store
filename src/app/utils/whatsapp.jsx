export const sendWhatsAppMessage = (product, phoneNumber = "923000000000") => {
    // Message template for professional look
    const message = `*--- New Order ---*%0A` +
                    `*Product:* ${product.name}%0A` +
                    `*Price:* $${product.price}%0A` +
                    `*Description:* ${product.description || 'No description'}%0A` +
                    `*Link:* ${product.image_url}%0A%0A` +
                    `Please confirm the order.`;

    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${message}`;
    window.open(whatsappUrl, '_blank');
};