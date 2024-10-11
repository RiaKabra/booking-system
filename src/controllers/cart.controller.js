import { addBookToCart ,removeBookFromCart,getCartbyUserID} from '../services/cart.service';
import HttpStatus from 'http-status-codes';
   export const getUserCart = async(req,res,next) => {
    try{
        const userId = req.user.id; 
        cart = await getCartbyUserID(userId);
        res.status(HttpStatus.OK).json({ message: 'Cart rerieved', cart: cart });
    }
    catch(error)
    {
        console.error('Error adding book to cart:', error);
            next(error);  
    }
   }

    export const addBookToUserCart = async (req, res, next) => {
        try {
            const userId = req.user.id; 
            const bookId = req.params._id; 
    
            console.log('Authenticated User ID:', userId);
            console.log('Book ID to add:', bookId);
    
            const updatedCart = await addBookToCart(userId, bookId);
    
            res.status(HttpStatus.OK).json({ message: 'Book added to cart', cart: updatedCart });
        } catch (error) {
            console.error('Error adding book to cart:', error);
            next(error); 
        }
    };

    export const removeBookFromUserCart = async (req, res, next) => {
        try {
            const userId = req.user.id; 
            const bookId = req.params._id; 
    
            console.log('Authenticated User ID:', userId);
            console.log('Book ID to remove:', bookId);
    
            const updatedCart = await removeBookFromCart(userId, bookId);
    
            res.status(HttpStatus.OK).json({ message: 'Book removed from cart', cart: updatedCart });
        } catch (error) {
            console.error('Error removing book from cart:', error);
            next(error); 
        }
    };