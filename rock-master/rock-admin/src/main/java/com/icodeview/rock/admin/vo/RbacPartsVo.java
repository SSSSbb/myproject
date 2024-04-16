package com.icodeview.rock.admin.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RbacPartsVo {
    private Integer id;
    private String name;
    private String spec;
    private String model;
    private String sup;
    private String man;
    private Integer belongto;
    private Integer diposed;
    private Integer remain;
    private Integer used;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime buyAt;

}
