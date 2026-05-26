package com.tf.tfdb.util;

import org.apache.commons.csv.CSVFormat;
import org.apache.commons.csv.CSVParser;
import org.apache.commons.csv.CSVRecord;

import java.io.StringReader;
import java.util.*;

/**
 * 前端传的是 csvText（字符串）。这里解析：
 * - 支持英文表头：student_no,name,class_name,major,grade
 * - 也兼容中文表头：学号,姓名,班级,专业,年级（可选）
 */
public class CsvImportUtils {

    public record StudentRow(String studentNo, String name, String className, String major, String grade, String raw) {}

    public record ParseResult(boolean headerOk, List<StudentRow> rows) {}

    public static ParseResult parse(String csvText) {
        if (csvText == null) return new ParseResult(false, List.of());
        String trimmed = csvText.trim();
        if (trimmed.isEmpty()) return new ParseResult(false, List.of());

        // 兼容 


        String normalized = trimmed.replace("\r\n", "\n").replace("\r", "\n");

        try (CSVParser parser = CSVFormat.DEFAULT
                .builder()
                .setHeader()
                .setSkipHeaderRecord(true)
                .setIgnoreEmptyLines(true)
                .setTrim(true)
                .build()
                .parse(new StringReader(normalized))) {

            Map<String, Integer> headerMap = parser.getHeaderMap();
            // Header names as-is:
            Set<String> headers = new HashSet<>();
            for (String h : headerMap.keySet()) headers.add(h.trim());

            String hStudentNo = pick(headers, "student_no", "学号");
            String hName = pick(headers, "name", "姓名");
            String hClass = pick(headers, "class_name", "班级");
            String hMajor = pick(headers, "major", "专业");
            String hGrade = pick(headers, "grade", "年级");

            boolean ok = (hStudentNo != null && hName != null);
            if (!ok) return new ParseResult(false, List.of());

            List<StudentRow> rows = new ArrayList<>();
            for (CSVRecord r : parser) {
                // commons-csv 会把 header 也作为第一条 record 吗？setHeader() 会识别第一行作为 header，不会作为 record
                String studentNo = get(r, hStudentNo);
                String name = get(r, hName);
                String className = hClass == null ? null : get(r, hClass);
                String major = hMajor == null ? null : get(r, hMajor);
                String grade = hGrade == null ? null : get(r, hGrade);

                String raw = String.join(",",
                        safe(studentNo), safe(name), safe(className), safe(major), safe(grade));

                rows.add(new StudentRow(studentNo, name, className, major, grade, raw));
            }
            return new ParseResult(true, rows);
        } catch (Exception e) {
            return new ParseResult(false, List.of());
        }
    }

    private static String pick(Set<String> headers, String... candidates) {
        for (String c : candidates) {
            for (String h : headers) {
                if (h.equalsIgnoreCase(c)) return h;
            }
        }
        return null;
    }

    private static String get(CSVRecord r, String header) {
        try {
            String v = r.get(header);
            return v == null ? null : v.trim();
        } catch (Exception e) {
            return null;
        }
    }

    private static String safe(String s) {
        return s == null ? "" : s;
    }
}
