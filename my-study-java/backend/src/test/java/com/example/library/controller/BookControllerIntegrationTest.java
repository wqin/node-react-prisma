package com.example.library.controller;

import com.example.library.model.Book;
import com.example.library.repository.BookRepository;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.web.servlet.AutoConfigureMockMvc;
import org.springframework.boot.test.context.SpringBootTest;
import org.springframework.test.web.servlet.MockMvc;

import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.get;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@SpringBootTest
@AutoConfigureMockMvc
class BookControllerIntegrationTest {
    @Autowired
    MockMvc mvc;

    @Autowired
    BookRepository repo;

    @BeforeEach
    void setup() {
        repo.deleteAll();
        repo.save(new Book("A", "B", "C"));
    }

    @Test
    void list_returnsBooks() throws Exception {
        mvc.perform(get("/api/books")).andExpect(status().isOk()).andExpect(jsonPath("$[0].title").value("A"));
    }
}
