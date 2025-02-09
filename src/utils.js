export function hoverCheck(selector, event) {
    try {
        // Guard clauses
        if (!selector || !event) return false;
        
        // Get elements
        const elements = document.querySelectorAll(selector);
        if (!elements || elements.length === 0) return false;

        // Check each element
        for (let i = 0; i < elements.length; i++) {
            const rect = elements[i].getBoundingClientRect();
            if (
                event.clientX >= rect.left &&
                event.clientX <= rect.right &&
                event.clientY >= rect.top &&
                event.clientY <= rect.bottom
            ) {
                return true;
            }
        }
        
        return false;
    } catch (error) {
        console.error('Error in hoverCheck:', error);
        return false;
    }
}