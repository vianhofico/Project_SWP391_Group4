package com.javaweb.repository.custom.impl;

import com.javaweb.dto.request.UserSearchRequest;
import com.javaweb.dto.request.UserSortRequest;
import com.javaweb.entity.User;
import com.javaweb.repository.custom.UserRepositoryCustom;
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
public class UserRepositoryCustomImpl implements UserRepositoryCustom {

    @PersistenceContext
    EntityManager entityManager;

    private void buildQuery(UserSearchRequest searchRequest, UserSortRequest sortRequest, StringBuilder sql, Map<String, Object> parameters) {
        if (searchRequest.getFullName() != null && !searchRequest.getFullName().equals("")) {
            sql.append(" AND fullName LIKE :fullName");
            parameters.put("fullName", "%" + searchRequest.getFullName() + "%");
        }

        if (searchRequest.getRole() != null && !searchRequest.getRole().equals("")) {
            sql.append(" AND role LIKE :role");
            parameters.put("role", "%" + searchRequest.getRole() + "%");
        }

        if (searchRequest.getIsActive() != null) {
            sql.append(" AND isActive = :isActive");
            parameters.put("isActive", searchRequest.getIsActive());
        }

        if (sortRequest != null && sortRequest.getSortField() != null && sortRequest.getSortOrder() != null
                && !sortRequest.getSortField().equals("") && !sortRequest.getSortOrder().equals("")){
            sql.append(" ORDER BY ").append(sortRequest.getSortField()).append(" ").append(sortRequest.getSortOrder());
        }
    }

    @Override
    public Page<User> getAllUsers(UserSearchRequest searchRequest, UserSortRequest sortRequest, Pageable pageable) {
        StringBuilder sql = new StringBuilder("SELECT u FROM User u where 1=1 ");
        StringBuilder countSql = new StringBuilder("SELECT COUNT(u) FROM User u where 1=1 ");
        Map<String, Object> parameters = new HashMap<>();

        buildQuery(searchRequest, sortRequest, sql, parameters);
        buildQuery(searchRequest, null, countSql, parameters);

        try {
            Query query = entityManager.createQuery(sql.toString(), User.class);
            Query countQuery = entityManager.createQuery(countSql.toString());

            for (Map.Entry<String, Object> entry : parameters.entrySet()) {
                query.setParameter(entry.getKey(), entry.getValue());
                countQuery.setParameter(entry.getKey(), entry.getValue());
            }

            int firstResult = pageable.getPageNumber() * pageable.getPageSize();
            query.setFirstResult(firstResult);//offset
            query.setMaxResults(pageable.getPageSize());//limit

            @SuppressWarnings("unchecked")
            List<User> users = query.getResultList();

            long totalRecords = (long) countQuery.getSingleResult();

            return new PageImpl<>(users, pageable, totalRecords);
        } catch (Exception e) {
            e.printStackTrace();
            return Page.empty();
        }
    }

    public Integer getReportCount(Long userId) {
        StringBuilder sql = new StringBuilder("SELECT COUNT(r) FROM Report r WHERE r.target.userId = :userId AND r.status = 'approved'");
        try {
            Query query = entityManager.createQuery(sql.toString());
            query.setParameter("userId", userId);
            return ((Long) query.getSingleResult()).intValue();
        } catch (RuntimeException e) {
            e.printStackTrace();
            return null;
        }
    }

}
