package com.smartsalon.dto;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

public class SlotAvailabilityDTO {

    private String slot;
    private LocalDate date;
    private int totalCapacity;
    private long bookedCount;
    private long remainingSeats;
    private int occupancyPercent;
    private String status;
    private String statusLabel;
    private boolean soldOut;
    private List<String> bookedStylistIds = new ArrayList<>();

    public SlotAvailabilityDTO() {}

    public String getSlot() { return slot; }
    public void setSlot(String slot) { this.slot = slot; }

    public LocalDate getDate() { return date; }
    public void setDate(LocalDate date) { this.date = date; }

    public int getTotalCapacity() { return totalCapacity; }
    public void setTotalCapacity(int totalCapacity) { this.totalCapacity = totalCapacity; }

    public long getBookedCount() { return bookedCount; }
    public void setBookedCount(long bookedCount) { this.bookedCount = bookedCount; }

    public long getRemainingSeats() { return remainingSeats; }
    public void setRemainingSeats(long remainingSeats) { this.remainingSeats = remainingSeats; }

    public int getOccupancyPercent() { return occupancyPercent; }
    public void setOccupancyPercent(int occupancyPercent) { this.occupancyPercent = occupancyPercent; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getStatusLabel() { return statusLabel; }
    public void setStatusLabel(String statusLabel) { this.statusLabel = statusLabel; }

    public boolean isSoldOut() { return soldOut; }
    public void setSoldOut(boolean soldOut) { this.soldOut = soldOut; }

    public List<String> getBookedStylistIds() { return bookedStylistIds; }
    public void setBookedStylistIds(List<String> bookedStylistIds) { this.bookedStylistIds = bookedStylistIds; }
}
