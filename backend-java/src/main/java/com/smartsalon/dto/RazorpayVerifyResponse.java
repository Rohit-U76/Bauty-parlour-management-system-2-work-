package com.smartsalon.dto;

public class RazorpayVerifyResponse {
    private boolean success;
    private String status;
    private String paymentId;
    private String orderId;
    private String bookingRef;
    private double advancePaid;
    private double totalAmount;
    private double balanceDue;
    private String paidAt;
    private String paymentMethod;
    private String message;

    public RazorpayVerifyResponse() {}

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getBookingRef() { return bookingRef; }
    public void setBookingRef(String bookingRef) { this.bookingRef = bookingRef; }

    public double getAdvancePaid() { return advancePaid; }
    public void setAdvancePaid(double advancePaid) { this.advancePaid = advancePaid; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public double getBalanceDue() { return balanceDue; }
    public void setBalanceDue(double balanceDue) { this.balanceDue = balanceDue; }

    public String getPaidAt() { return paidAt; }
    public void setPaidAt(String paidAt) { this.paidAt = paidAt; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
}
