package com.example.library.mapper;

import java.util.List;
import com.example.library.model.Book;
import org.apache.ibatis.annotations.Mapper;

@Mapper
public interface BookMapper {
    List<Book> findAll();
    Book findById(Long id);
    int insert(Book book);
    int update(Book book);
    int delete(Long id);
}
