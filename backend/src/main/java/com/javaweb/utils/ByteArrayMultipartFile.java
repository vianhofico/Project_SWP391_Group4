package com.javaweb.utils;

import lombok.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.*;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
@Builder
public class ByteArrayMultipartFile implements MultipartFile {

    private String name;
    private String originalFilename;
    private String contentType;
    private byte[] content;


    @Override
    public boolean isEmpty() {
        return content == null;
    }

    @Override
    public long getSize() {
        return content.length;
    }

    @Override
    public byte[] getBytes() throws IOException {
        return content;
    }

    @Override
    public InputStream getInputStream() throws IOException {
        return new ByteArrayInputStream(content);
    }

    @Override
    public void transferTo(File dest) throws IOException, IllegalStateException {
        throw new UnsupportedEncodingException();
    }
}
