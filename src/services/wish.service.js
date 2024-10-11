import Wish from '../models/wishlist.model'
import Book from '../models/book.model'; 

export const getWishbyUserID = async (userID) => {
    return await Wish.findOne({ wishBy: userID });
};
export const addBookToWishlist = async (userID, bookID) => {
    let wish = await getWishbyUserID(userID);

    const book = await Book.findById(bookID);
    if (!book) {
        throw new Error("Book not found in database");
    }

    if (!wish) {
        wish = new Wish({
            wishBy: userID,
            book: []
        });
    }

    const existingBook = wish.book.find(b => b._id.toString() === book._id.toString());

    if (existingBook) {
        return { message: "Book already in wishlist" };
    } else {
        wish.book.push({
            _id: book._id,
            bookname: book.bookName,
            authorname:book.authorname

        });
    }

    await wish.save();
    return { message: "Book added to wishlist", wishlist: wish };
};

export const removeBookFromWishlist = async (userID, bookID) => {
    let wish = await getWishbyUserID(userID);

    if (!wish) {
        throw new Error("Wishlist not found");
    }

    const book = await Book.findById(bookID);
    if (!book) {
        throw new Error("Book not found in database");
    }

    const existingBook = wish.book.find(b => b._id.toString() === book._id.toString());

    if (!existingBook) {
        return { message: "Book not found in wishlist" };
    }

    wish.book = wish.book.filter(b => b._id.toString() !== existingBook._id.toString());

    if (wish.book.length === 0) {
        await Wish.deleteOne({ _id: wish._id });
        return { message: "Wishlist is now empty and has been removed." };
    }

    await wish.save();
    return { message: "Book removed from wishlist", wishlist: wish };
};
