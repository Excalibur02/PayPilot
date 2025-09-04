package com.paypilot.service;

import com.paypilot.model.*;
import com.paypilot.repository.ScheduledPaymentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.*;


@Service
public class ScheduledPaymentService {

    @Autowired
    private ScheduledPaymentRepository scheduledPaymentRepository;

    @Autowired
    private PaymentService paymentService;

    @Autowired
    private BillService billService;

    public ScheduledPayment schedulePayment(ScheduledPayment payment) {
        return scheduledPaymentRepository.save(payment);
    }

    public List<ScheduledPayment> getAllScheduledPayments() {
        return scheduledPaymentRepository.findAll();
    }

    public List<ScheduledPayment> getPaymentsByUserId(Long userId) {
        return scheduledPaymentRepository.getPaymentsByUserSorted(userId);
    }

    public List<ScheduledPayment> getUpcomingPayments(Long userId) {
        return scheduledPaymentRepository.getUpcomingPayments(userId);
    }

    public List<ScheduledPayment> getPastPayments(Long userId) {
        return scheduledPaymentRepository.getPastPayments(userId);
    }


    public void createScheduledPaymentFromBill(Bill bill){
        try{
            if(bill.isAutoPayEnabled()==true){
                ScheduledPayment scheduledPayment = new ScheduledPayment(bill.getUserId(), bill.getId(), bill.getAmount(), bill.getDueDate(),bill.getPaymentMethod());
                schedulePayment(scheduledPayment);
            }else {
                throw new RuntimeException("Auto pay is disabled !");
            }

        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

    public Payment getPaymentFromScheduledPayment(Long id){
        Optional<ScheduledPayment> scheduledPayment = scheduledPaymentRepository.findById(id);
        try{
            ScheduledPayment thisPayment = scheduledPayment.get();
            LocalDate todaysDate = LocalDate.now();
            Payment payment = new Payment(thisPayment.getBillId(), thisPayment.getUserId(), thisPayment.getAmount(), thisPayment.getPaymentMethod(), todaysDate);
            return payment;
        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }
//    marking as paid
    public void setScheduledPaymentStatusPaid(Long id){
        Optional<ScheduledPayment> scheduledPayment = scheduledPaymentRepository.findById(id);
        try{
            ScheduledPayment thisPayment = scheduledPayment.get();
            ScheduledPayment newScheduledPayment = new ScheduledPayment(thisPayment.getUserId(), thisPayment.getBillId(), thisPayment.getAmount(),thisPayment.getScheduledDate(), thisPayment.getPaymentMethod());

            // adding to completed payments
            Payment payment = getPaymentFromScheduledPayment(id);
            paymentService.addPayment(payment);

            // updating the scheduled payment and setting new schedule for the next billing cycle
            Bill bill = billService.getBillById(thisPayment.getBillId());
            LocalDate dueDate = bill.getNextDueDate();
            String frequency = String.valueOf(bill.getFrequency());
            thisPayment.setIsPaid(true);
            if(frequency.equalsIgnoreCase("ONCE")){
                schedulePayment(thisPayment);
                return;
            }
            else if(frequency.equalsIgnoreCase("WEEKLY")) {
                newScheduledPayment.setScheduledDate(dueDate.plusDays(7));
                bill.setNextDueDate(dueDate.plusDays(7));
            }
            else if(frequency.equalsIgnoreCase("MONTHLY")){
                newScheduledPayment.setScheduledDate(dueDate.plusMonths(1));
                bill.setNextDueDate(dueDate.plusMonths(1));
            }
            else if(frequency.equalsIgnoreCase("YEARLY")){
                newScheduledPayment.setScheduledDate(dueDate.plusYears(1));
                bill.setNextDueDate(dueDate.plusYears(1));
            }
            billService.addBill(bill);
            schedulePayment(thisPayment);
            schedulePayment(newScheduledPayment);

        } catch (RuntimeException e) {
            throw new RuntimeException(e);
        }
    }

//    updating scheduled payment
    public ScheduledPayment updatePayment(Long id, ScheduledPayment updated) {
        Optional<ScheduledPayment> currPayment = scheduledPaymentRepository.findById(id);
        Bill currBill = null;
        if(currPayment.isPresent()){
            currBill = billService.getBillById(currPayment.get().getBillId());
        }
        assert (currBill != null);
        currBill.setAutoPayEnabled(false);
        currBill.setRecurring(false);
        currBill.setFrequency(Frequency.ONCE);
        currBill.setNextDueDate(currPayment.get().getScheduledDate());
        billService.addBill(currBill);

        return scheduledPaymentRepository.findById(id).map(existing -> {
            existing.setBillId(updated.getBillId());
            existing.setAmount(updated.getAmount());
            existing.setPaymentMethod(updated.getPaymentMethod());
            existing.setScheduledDate(updated.getScheduledDate());
            return scheduledPaymentRepository.save(existing);
        }).orElseThrow(() -> new RuntimeException("Payment not found with id " + id));
    }

    public void deletePayment(Long id) {
        Optional<ScheduledPayment> currPayment = scheduledPaymentRepository.findById(id);
        Bill currBill = null;
        if(currPayment.isPresent()){
            currBill = billService.getBillById(currPayment.get().getBillId());
        }
        assert (currBill != null);
        currBill.setAutoPayEnabled(false);
        currBill.setRecurring(false);
        currBill.setFrequency(Frequency.ONCE);
        currBill.setNextDueDate(currPayment.get().getScheduledDate());
        billService.addBill(currBill);
        scheduledPaymentRepository.deleteById(id);
    }


}
