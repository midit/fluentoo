package com.fluentooapp.fluentoo.service.impl;

import com.fluentooapp.fluentoo.entity.Subject;
import com.fluentooapp.fluentoo.repository.SubjectRepository;
import com.fluentooapp.fluentoo.service.SubjectService;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
public class SubjectServiceImpl implements SubjectService {

    private static final Logger logger = LoggerFactory.getLogger(SubjectServiceImpl.class);

    @Autowired
    private SubjectRepository subjectRepository;

    @Override
    @Transactional(readOnly = true)
    public List<Subject> getAllSubjects() {
        try {
            logger.info("Getting all subjects");
            List<Subject> subjects = subjectRepository.findAll();
            logger.info("Found {} subjects", subjects.size());
            return subjects;
        } catch (Exception e) {
            logger.error("Error getting subjects", e);
            throw e;
        }
    }
}