package com.smartsalon.dto;

import java.util.List;

public class AiRecommendResponse {
    private String summary;
    private List<String> recommendedServiceNames;
    private String suggestedStylist;
    private String recommendedCoupon;
    private String professionalTip;
    private double estimatedTotal;
    private double advanceDeposit;

    public AiRecommendResponse() {}

    public String getSummary() { return summary; }
    public void setSummary(String summary) { this.summary = summary; }

    public List<String> getRecommendedServiceNames() { return recommendedServiceNames; }
    public void setRecommendedServiceNames(List<String> recommendedServiceNames) { this.recommendedServiceNames = recommendedServiceNames; }

    public String getSuggestedStylist() { return suggestedStylist; }
    public void setSuggestedStylist(String suggestedStylist) { this.suggestedStylist = suggestedStylist; }

    public String getRecommendedCoupon() { return recommendedCoupon; }
    public void setRecommendedCoupon(String recommendedCoupon) { this.recommendedCoupon = recommendedCoupon; }

    public String getProfessionalTip() { return professionalTip; }
    public void setProfessionalTip(String professionalTip) { this.professionalTip = professionalTip; }

    public double getEstimatedTotal() { return estimatedTotal; }
    public void setEstimatedTotal(double estimatedTotal) { this.estimatedTotal = estimatedTotal; }

    public double getAdvanceDeposit() { return advanceDeposit; }
    public void setAdvanceDeposit(double advanceDeposit) { this.advanceDeposit = advanceDeposit; }
}
