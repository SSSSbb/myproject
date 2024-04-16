package com.icodeview.rock.admin.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RbacMaintainRecordVo {
    private Integer id;
    private Integer eid;
    private byte[] enpSign;
    private byte[] safeSign;
    private String maintainer;
    private String safer;
    private Integer belongto;
    private String project;
    private String work;
    private Integer partsRecord;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}
