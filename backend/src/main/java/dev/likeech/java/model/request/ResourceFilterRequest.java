package dev.likeech.java.model.request;

import dev.likeech.java.entity.ResourceType;

public record ResourceFilterRequest(
        String title,
        ResourceType type,
        String sortBy,
        String direction,
        Integer page,
        Integer size
) {
    public int pageSafe() {
        return page != null && page >= 0 ? page : 0;
    }

    public int sizeSafe() {
        return size != null && size > 0 ? size : 10;
    }

    public String sortBySafe() {
        return sortBy != null ? sortBy : "";
    }

    public String directionSafe() {
        return direction != null ? direction : "asc";
    }
}

