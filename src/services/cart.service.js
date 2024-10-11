import Cart from '../models/cartby.model';
import Book from '../models/book.model'; 

export const getCartbyUserID = async (userID) => {
    return await Cart.findOne({ cartBy: userID });
};

export const addBookToCart = async (userID, bookID) => {
    let cart = await getCartbyUserID(userID);

    const book = await Book.findById(bookID);
    if (!book) {
        throw new Error("Book not found");
    }

    if (!cart) {
        cart = new Cart({
            cartBy: userID,
            book: []
        });
    } 
    const existingBook = cart.book.find(b => b._id.toString() === book._id.toString());

    if (existingBook) {
        existingBook.quantity += 1;
    } else {
        cart.book.push({
            _id: book._id,
            bookname: book.bookName,
            price: book.price,
            discountPrice: book.discountPrice,
            quantity: 1 
        });
    }

    cart.cartTotal = cart.book.reduce((total, b) => {
        console.log("Price details for book in cart:", b.bookname, b.discountPrice, b.price);
        const effectivePrice = b.discountPrice !== null && b.discountPrice !== undefined
            ? b.discountPrice 
            : b.price;        

        return total + (effectivePrice * b.quantity); 
    }, 0); 

    return await cart.save();
};

export const removeBookFromCart = async (userID, bookID) => {
    let cart = await getCartbyUserID(userID);

    if (!cart) {
        throw new Error("Cart not found");
    }

    const book = await Book.findById(bookID);
    if (!book) {
        throw new Error("Book not found");
    }

    const existingBook = cart.book.find(b => b._id.toString() === book._id.toString());

    if (!existingBook) {
        throw new Error("Book not found in cart");
    }

    existingBook.quantity -= 1;

    if (existingBook.quantity <= 0) {
        cart.book = cart.book.filter(b => b._id.toString() !== existingBook._id.toString());
    }

    if (cart.book.length > 0) {
        cart.cartTotal = cart.book.reduce((total, b) => {
            const effectivePrice = b.discountPrice !== null && b.discountPrice !== undefined
                ? b.discountPrice
                : b.price;

            return total + (effectivePrice * b.quantity);
        }, 0); 
    } else {
        cart.cartTotal = 0;
    }

    if (cart.book.length === 0) {
        await Cart.deleteOne({ _id: cart._id }); 
        return { message: "Cart is now empty and has been removed." };
    }

    return await cart.save();
};
