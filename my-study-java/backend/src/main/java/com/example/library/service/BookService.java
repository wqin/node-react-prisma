package com.example.library.service;

import com.example.library.dto.BookDTO;

import java.util.List;
import org.springframework.data.domain.Page;
import java.util.Optional;

/**
 * 提供对图书（BookDTO）相关业务操作的服务接口说明：列出、查询、创建、删除及导出为 Excel。
 *
 * 方法说明（摘要）：
 * - list()
 *     返回所有图书的 DTO 列表。返回值应为非 null；若无记录则返回空列表。
 *
 * - get(Long id)
 *     根据给定的 id 查询单本图书，返回 Optional 包装的 BookDTO。若未找到则返回 Optional.empty()。
 *     对于入参 id 为 null，建议抛出 IllegalArgumentException。
 *
 * - create(BookDTO dto)
 *     创建新的图书记录并返回持久化后的 BookDTO（通常包含生成的 id 及持久化字段）。
 *     入参 dto 不应为 null，且应包含必要字段；参数校验失败可抛出 IllegalArgumentException 或自定义校验异常。
 *
 * - delete(Long id)
 *     删除指定 id 的图书记录。实现可选择在记录不存在时抛出异常（例如 EntityNotFoundException）或静默忽略。
 *     对于 id 为 null，建议抛出 IllegalArgumentException。
 *
 * - exportToExcel()
 *     将当前（或符合条件的）图书数据导出为 Excel 格式，返回生成的字节数组（例如 .xlsx 内容）。
 *     返回值应为非 null；若无内容可返回空字节数组 new byte[0]。
 *
 * 事务与并发：
 * - 写操作（如 create、delete）应在实现中根据需要使用事务保证原子性。
 * - 线程安全性由具体实现负责；无状态实现更易于并发使用。
 *
 * 错误与边界约定（建议）：
 * - 对于不可接受的入参统一抛出 IllegalArgumentException。
 * - 对于未找到的资源，可使用 Optional.empty()（查询）或抛出明确的未找到异常（删除/更新场景视需求）。
 *
 * 实现建议：
 * - DTO 与实体之间的映射应由单独的转换器/映射层负责（如 MapStruct）。
 * - 导出为 Excel 可采用 Apache POI 等库生成 .xlsx，再将输出流转为字节数组返回。
 */
public interface BookService {
    List<BookDTO> list();
    Page<BookDTO> list(int page, int size);
    Optional<BookDTO> get(Long id);
    BookDTO create(BookDTO dto);
    BookDTO update(Long id, BookDTO dto);
    void delete(Long id);
    byte[] exportToExcel();
}
