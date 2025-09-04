package com.paypilot.service;

import com.paypilot.model.Bill;
import com.paypilot.model.ScheduledPayment;
import com.paypilot.repository.BillRepository;
import com.paypilot.repository.ScheduledPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class BillService {

    @Autowired
    private BillRepository billRepository;

    @Autowired
    private ScheduledPaymentRepository scheduledPaymentRepository;

    public Bill addBill(Bill bill) {
        return billRepository.save(bill);
    }

    public List<Bill> getAllBills() {
        return billRepository.findAll();
    }

    public Bill getBillById(Long billId){
        return billRepository.findById(billId).orElse(null);
    }
    public List<Bill> getAllBillsByUserId(Long userId) {
        return billRepository.findByUserId(userId);
    }

    public List<Bill> getBillsByUserIdAndCategory(Long userId, String category) {
        return billRepository.findByUserIdAndCategory(userId, category);
    }

    public List<Bill> getBillsByCategory(String category) {
        System.out.println("Category in service: '" + category + "'");
        List<Bill> results = billRepository.findByCategoryIgnoreCase(category);
        System.out.println("Results from DB: " + results.size());
        for (Bill b : results) {
            System.out.println("➡️ Found: " + b.getTitle() + " | " + b.getCategory());
        }
        return results;

    }

    public Bill updateBill(Bill bill) {
        Long billId = bill.getId();
        try {
            Bill original = getBillById(billId);

            original.setTitle(bill.getTitle());
            original.setAmount(bill.getAmount());
            original.setCategory(bill.getCategory());
            original.setDueDate(bill.getDueDate());
            original.setRecurring(bill.isRecurring());
            original.setFrequency(bill.getFrequency());
            original.setPaid(bill.isPaid());
            original.setSnoozeReminders(bill.isSnoozeReminders());

            // Preserve the incoming nextDueDate (don’t blindly overwrite with dueDate)
            if (bill.getNextDueDate() != null) {
                original.setNextDueDate(bill.getNextDueDate());
            }

            // ✅ Persist changes to DB
            return billRepository.save(original);
        } catch (Exception e) {
            throw new RuntimeException("Failed to update bill with id: " + billId, e);
        }
    }

    public void deleteBill(Bill bill){
        try{
            billRepository.delete(bill);
            scheduledPaymentRepository.deleteByBillId(bill.getId());
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }


}
