const {instance} = require('../utils/razorPay')
const crypto = require('crypto')
const {paymentModel} = require('../Modals/Payment') 
const paymentCheckout = async (req,res)=>{
    const {price} = req.body
    try {
        
        console.log(price);
        const options = {
            amount : Number(price * 100),
            currency : "INR"
        }
    

        const order = await instance.orders.create(options)

    
        console.log(order)
        res.json({
            success:true,
            
            order
        })
    } catch (error) {
        console.log(error);
    }
}


const paymentVerification = async (req,res)=>{
    console.log("verification",req.body);
    const {razorpay_payment_id, razorpay_order_id, razorpay_signature} = req.body

    const body = razorpay_order_id + '|' +  razorpay_payment_id 

    const expectedSignature = crypto.createHmac('sha256', process.env.RAZORPAY_API_SECRET)
    .update(body.toString())
    .digest('hex')

    if (expectedSignature === razorpay_signature){
        await paymentModel.create({
            razorpay_payment_id,
            razorpay_order_id, 
            razorpay_signature
        })
        res.redirect(`http://localhost:5173/orderPlaced?reference=${razorpay_payment_id}`)
    }else{
        res.status(400).json({
            success:false
        })
    }
}
module.exports = {paymentCheckout,paymentVerification}