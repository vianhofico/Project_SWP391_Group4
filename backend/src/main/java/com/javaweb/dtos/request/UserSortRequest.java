package com.javaweb.dtos.request;

import jakarta.validation.constraints.Pattern;

public record UserSortRequest(

        @Pattern(regexp = "fullName|birthDate|reportCount|", flags = Pattern.Flag.CASE_INSENSITIVE, message = "Sort field must be fullName OR birthDate OR reportCount OR NONE")
        String sortField,
        @Pattern(regexp = "ASC|DESC|", flags = Pattern.Flag.CASE_INSENSITIVE, message = "Sort order must be ASC or DESC or NONE")
        String sortOrder
) {
}
