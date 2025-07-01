import { supabase } from "@repo/supabaseclient";




export const authMiddleware = async (req, res, next) => {
  console.log(`inside  middeware`);
  
    try {
    // Get the authorization header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      return res.status(401).json({
        error: "Missing or invalid authorization header",
        message: "Please provide a valid Bearer token",
      });
    }

    // Extract the token
    const token = authHeader.substring(7); // Remove "Bearer " prefix

    if (!token) {
      return res.status(401).json({
        error: "No token provided",
        message: "Authorization token is required",
      });
    }

    
    // Verify the token with Supabase
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser(token);

    if (error) {
      console.error("Token verification error:", error);
      return res.status(401).json({
        error: "Invalid token",
        message: "The provided token is invalid or expired",
        details: error.message,
      });
    }
        console.log(`got value from supabase web`);
        

    if (!user) {
      return res.status(401).json({
        error: "User not found",
        message: "No user associated with this token",
      });
    }
        

    // Add user information to the request object
    req.userId = user.id;
    req.user = user; // Optional: add full user object if needed
    req.userEmail = user.email;

    console.log("Authenticated user:", {
      id: user.id,
      email: user.email,
    });

    // Continue to the next middleware/route handler
    next();
  } catch (error) {
    console.error("Auth middleware error:", error);
    return res.status(500).json({
      error: "Internal server error",
      message: "Failed to authenticate user",
    });
  }
};
