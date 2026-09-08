package com.smartsalon.dto;

public class AiRecommendRequest {
    private String gender;
    private String serviceInterest;
    private String hairOrSkinConcern;
    private String occasion;
    private String budgetRange;

    public AiRecommendRequest() {}

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getServiceInterest() { return serviceInterest; }
    public void setServiceInterest(String serviceInterest) { this.serviceInterest = serviceInterest; }

    public String getHairOrSkinConcern() { return hairOrSkinConcern; }
    public void setHairOrSkinConcern(String hairOrSkinConcern) { this.hairOrSkinConcern = hairOrSkinConcern; }

    public String getOccasion() { return occasion; }
    public void setOccasion(String occasion) { this.occasion = occasion; }

    public String getBudgetRange() { return budgetRange; }
    public void setBudgetRange(String budgetRange) { this.budgetRange = budgetRange; }
}
