package com.javaweb.repository.custom.impl;

import com.javaweb.dto.request.ReportRequest;
import com.javaweb.entity.Report;
import com.javaweb.repository.custom.ReportRepositoryCustom;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Query;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Repository
public class ReportRepositoryCustomImpl implements ReportRepositoryCustom {

    @PersistenceContext
    EntityManager entityManager;

    //for search report list
    private void joinTable (ReportRequest reportRequest, StringBuilder sql) {
        if (reportRequest.getReporterName() != null && !reportRequest.getReporterName().equals("")) {
            sql.append(" LEFT JOIN r.reporter rp ");
        }
        if (reportRequest.getTargetName() != null && !reportRequest.getTargetName().equals("")) {
            sql.append(" LEFT JOIN r.target tg ");
        }
    }

    private void buildQuery(ReportRequest reportRequest, StringBuilder sql, Map<String, Object> parameters, boolean isCountQuery) {
        if (reportRequest == null) return;
        if (reportRequest.getStatus() != null && !reportRequest.getStatus().equals("")) {
            sql.append(" AND r.status = :status");
            parameters.put("status", reportRequest.getStatus());
        }
        if (reportRequest.getReporterName() != null && !reportRequest.getReporterName().equals("")) {
            sql.append(" AND rp.fullName LIKE :reporterName");
            parameters.put("reporterName", "%" + reportRequest.getReporterName() + "%");
        }
        if (reportRequest.getTargetName() != null && !reportRequest.getTargetName().equals("")) {
            sql.append(" AND tg.fullName LIKE :targetName");
            parameters.put("targetName", "%" + reportRequest.getTargetName() + "%");
        }
        if (reportRequest.getSortOrder() != null && !reportRequest.getSortOrder().equals("") && !isCountQuery) {
            sql.append(" ORDER BY r.createdAt " + reportRequest.getSortOrder());
        }

    }

    @Override
    public Page<Report> getAllReports(ReportRequest reportRequest, Pageable pageable) {
        StringBuilder sql = new StringBuilder("SELECT r FROM Report r ");
        StringBuilder countSql = new StringBuilder("SELECT COUNT(r) FROM Report r ");
        Map<String, Object> parameters = new HashMap<>();
        joinTable(reportRequest, sql);
        joinTable(reportRequest, countSql);
        sql.append(" WHERE 1=1 ");
        countSql.append(" WHERE 1=1 ");
        buildQuery(reportRequest, sql, parameters, false);
        buildQuery(reportRequest, countSql, parameters, true);

        try {
            Query query = entityManager.createQuery(sql.toString(), Report.class);
            Query countQuery = entityManager.createQuery(countSql.toString());

            for (Map.Entry<String, Object> entry : parameters.entrySet()) {
                query.setParameter(entry.getKey(), entry.getValue());
                countQuery.setParameter(entry.getKey(), entry.getValue());
            }

            int firstResult = pageable.getPageNumber() * pageable.getPageSize();
            query.setFirstResult(firstResult);
            query.setMaxResults(pageable.getPageSize());

            @SuppressWarnings("unchecked")
            List<Report> reports = query.getResultList();

            long totalRecords = (long) countQuery.getSingleResult();

            return new PageImpl<>(reports, pageable, totalRecords);
        } catch (Exception e) {
            e.printStackTrace();
            return Page.empty();
        }


    }
}
