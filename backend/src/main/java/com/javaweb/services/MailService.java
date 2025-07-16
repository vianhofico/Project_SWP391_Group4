package com.javaweb.services;

public interface MailService {

    void sendEmail(String to, String subject, String text);

}
