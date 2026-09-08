package com.smartsalon.dto;

import java.util.Map;

public class RazorpayOrderResponse {
    private boolean success;
    private String orderId;
    private String receiptId;
    private String currency;
    private double totalAmount;
    private int advancePercentage;
    private double advanceAmount;
    private double remainingAmount;
    private long amountInPaise;
    private String razorpayKeyId;
    private Map<String, String> customer;
    private Map<String, String> notes;

    public RazorpayOrderResponse() {}

    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public String getReceiptId() { return receiptId; }
    public void setReceiptId(String receiptId) { this.receiptId = receiptId; }

    public String getCurrency() { return currency; }
    public void setCurrency(String currency) { this.currency = currency; }

    public double getTotalAmount() { return totalAmount; }
    public void setTotalAmount(double totalAmount) { this.totalAmount = totalAmount; }

    public int getAdvancePercentage() { return advancePercentage; }
    public void setAdvancePercentage(int advancePercentage) { this.advancePercentage = advancePercentage; }

    public double getAdvanceAmount() { return advanceAmount; }
    public void setAdvanceAmount(double advanceAmount) { this.advanceAmount = advanceAmount; }

    public double getRemainingAmount() { return remainingAmount; }
    public void setRemainingAmount(double remainingAmount) { this.remainingAmount = remainingAmount; }

    public long getAmountInPaise() { return amountInPaise; }
    public void setAmountInPaise(long amountInPaise) { this.amountInPaise = amountInPaise; }

    public String getRazorpayKeyId() { return razorpayKeyId; }
    public void setRazorpayKeyId(String razorpayKeyId) { this.razorpayKeyId = razorpayKeyId; }

    public Map<String, String> getCustomer() { return customer; }
    public void setCustomer(Map<String, String> customer) { this.customer = customer; }

    public Map<String, String> getNotes() { return notes; }
    public void setNotes(Map<String, String> notes) { this.notes = notes; }
}
