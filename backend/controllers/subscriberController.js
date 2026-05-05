import subscriberModel from "../models/subscriberModel.js";
import nodemailer from "nodemailer";

// Configure email transporter
const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
        user: process.env.EMAIL,
        pass: process.env.EMAIL_PASSWORD
    }
});

// Subscribe user to newsletter
const subscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!email || !emailRegex.test(email)) {
            return res.json({ success: false, message: "Please enter a valid email address" });
        }

        // Check if email already subscribed
        const existingSubscriber = await subscriberModel.findOne({ email: email.toLowerCase() });
        if (existingSubscriber) {
            return res.json({ success: false, message: "This email is already subscribed" });
        }

        // Save subscriber to database
        const newSubscriber = new subscriberModel({ email: email.toLowerCase() });
        await newSubscriber.save();

        // Send confirmation email
        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: ' Welcome to Our Newsletter - Get 20% Off!',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 0;">
                    <!-- Header -->
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 40px 20px; text-align: center; color: white;">
                        <h1 style="margin: 0; font-size: 32px; font-weight: bold;"> Welcome!</h1>
                        <p style="margin: 10px 0 0 0; font-size: 16px; opacity: 0.9;">You've Successfully Subscribed</p>
                    </div>

                    <!-- Main Content -->
                    <div style="background: white; padding: 40px 30px;">
                        <h2 style="color: #333; font-size: 24px; margin: 0 0 20px 0;">Thank You for Subscribing!</h2>
                        
                        <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                            Hello,
                        </p>
                        
                        <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                            We're thrilled to have you join our community! You have successfully subscribed to our newsletter.
                        </p>

                        <!-- Offer Box -->
                        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; border-radius: 10px; text-align: center; margin: 30px 0; color: white;">
                            <p style="margin: 0 0 10px 0; font-size: 14px; opacity: 0.9;">EXCLUSIVE OFFER</p>
                            <h3 style="margin: 0; font-size: 48px; font-weight: bold;">20% OFF</h3>
                            <p style="margin: 10px 0 0 0; font-size: 16px;">Your First Purchase</p>
                        </div>

                        <!-- Benefits -->
                        <div style="background: #f8f9fa; padding: 20px; border-radius: 8px; margin: 30px 0;">
                            <h3 style="color: #333; margin: 0 0 15px 0; font-size: 18px;">What You'll Get:</h3>
                            <ul style="color: #666; font-size: 15px; line-height: 1.8; margin: 0; padding-left: 20px;">
                                <li> Exclusive deals and early access to new products</li>
                                <li> Special discounts and promotional offers</li>
                                <li> Weekly updates on trending items</li>
                                <li> First to know about flash sales</li>
                                <li> Birthday specials and rewards</li>
                            </ul>
                        </div>

                        <!-- CTA Button -->
                        <div style="text-align: center; margin: 30px 0;">
                            <a href="${process.env.FRONTEND_URL}" style="display: inline-block; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); color: white; padding: 15px 40px; text-decoration: none; border-radius: 5px; font-weight: bold; font-size: 16px;">
                                Start Shopping Now
                            </a>
                        </div>

                        <!-- Discount Code -->
                        <div style="background: #fff3cd; padding: 20px; border-radius: 8px; border-left: 4px solid #ffc107; margin: 30px 0;">
                            <p style="color: #856404; margin: 0 0 10px 0; font-size: 14px; font-weight: bold;">USE THIS CODE AT CHECKOUT:</p>
                            <p style="color: #333; margin: 0; font-size: 24px; font-weight: bold; letter-spacing: 2px;">WELCOME20</p>
                        </div>

                        <p style="color: #666; font-size: 15px; line-height: 1.6; margin: 30px 0 0 0;">
                            If you have any questions or need assistance, feel free to reach out to our customer support team.
                        </p>
                    </div>

                    <!-- Footer -->
                    <div style="background: #f8f9fa; padding: 30px; text-align: center; border-top: 1px solid #e0e0e0;">
                        <p style="color: #999; font-size: 14px; margin: 0 0 15px 0;">
                            Follow us on social media for more updates:
                        </p>
                        <div style="margin: 15px 0;">
                            <a href="#" style="display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none; font-weight: bold;">Facebook</a>
                            <a href="#" style="display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none; font-weight: bold;">Instagram</a>
                            <a href="#" style="display: inline-block; margin: 0 10px; color: #667eea; text-decoration: none; font-weight: bold;">Twitter</a>
                        </div>
                        <p style="color: #999; font-size: 12px; margin: 20px 0 0 0;">
                            © 2024 E-Commerce Store. All rights reserved.<br/>
                            You received this email because you subscribed to our newsletter.
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ 
            success: true, 
            message: "Successfully subscribed to newsletter" 
        });

    } catch (error) {
        console.log('Subscription error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Unsubscribe user from newsletter
const unsubscribeNewsletter = async (req, res) => {
    try {
        const { email } = req.body;

        if (!email) {
            return res.json({ success: false, message: "Email is required" });
        }

        const result = await subscriberModel.findOneAndDelete({ email: email.toLowerCase() });
        
        if (!result) {
            return res.json({ success: false, message: "Email not found in our list" });
        }

        const mailOptions = {
            from: process.env.EMAIL,
            to: email,
            subject: 'You\'ve Been Unsubscribed',
            html: `
                <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #f8f9fa; padding: 40px 20px;">
                    <div style="background: white; padding: 40px 30px; border-radius: 10px;">
                        <h2 style="color: #333; font-size: 24px; margin: 0 0 20px 0;">We'll Miss You!</h2>
                        
                        <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                            You have been successfully unsubscribed from our newsletter.
                        </p>

                        <p style="color: #666; font-size: 16px; line-height: 1.6; margin: 0 0 20px 0;">
                            We understand, and we respect your decision. If you change your mind in the future, you can always subscribe again.
                        </p>

                        <p style="color: #999; font-size: 14px; margin: 30px 0 0 0;">
                            Best regards,<br/>
                            The E-Commerce Team
                        </p>
                    </div>
                </div>
            `
        };

        await transporter.sendMail(mailOptions);

        res.json({ 
            success: true, 
            message: "Successfully unsubscribed from newsletter" 
        });

    } catch (error) {
        console.log('Unsubscribe error:', error);
        res.json({ success: false, message: error.message });
    }
};

// Get all subscribers (Admin only)
const getAllSubscribers = async (req, res) => {
    try {
        const subscribers = await subscriberModel.find({}).sort({ subscribedAt: -1 });
        const totalSubscribers = subscribers.length;

        res.json({
            success: true,
            subscribers,
            totalSubscribers
        });

    } catch (error) {
        console.log('Get subscribers error:', error);
        res.json({ success: false, message: error.message });
    }
};

export { subscribeNewsletter, unsubscribeNewsletter, getAllSubscribers };
