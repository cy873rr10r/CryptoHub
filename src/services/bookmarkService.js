import { doc, updateDoc, arrayUnion, arrayRemove, getDoc, setDoc } from "firebase/firestore";
import { db } from "../firebase";

/**
 * Toggles bookmark status for a blog post
 * @param {string} userId - Current user's ID
 * @param {number|string} blogId - ID of the blog post
 * @returns {Promise<boolean>} - Returns true if bookmarked, false if removed
 */
export const toggleBookmark = async (userId, blogId) => {
    if (!userId) throw new Error("User must be logged in to bookmark");

    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) {
        // Should not happen for logged in users, but safety check
        await setDoc(userRef, { bookmarks: [blogId] }, { merge: true });
        return true;
    }

    const userData = userDoc.data();
    const bookmarks = userData.bookmarks || [];
    const isBookmarked = bookmarks.includes(blogId);

    if (isBookmarked) {
        await updateDoc(userRef, {
            bookmarks: arrayRemove(blogId)
        });
        return false;
    } else {
        await updateDoc(userRef, {
            bookmarks: arrayUnion(blogId)
        });
        return true;
    }
};

/**
 * continued...
 * Fetches all bookmarked blog IDs for a user
 * @param {string} userId - Current user's ID
 * @returns {Promise<Array<string|number>>} - Array of bookmarked blog IDs
 */
export const getBookmarks = async (userId) => {
    if (!userId) return [];

    const userRef = doc(db, "users", userId);
    const userDoc = await getDoc(userRef);

    if (userDoc.exists()) {
        return userDoc.data().bookmarks || [];
    }

    return [];
};
