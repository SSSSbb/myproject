package com.icodeview.rock.admin.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;

@Data
public class RbacMaintainRecordVo {
    private Integer id;
    private Integer eid;
    private Integer returned;
    private byte[] enpSign;
    private byte[] safeSign;
    private byte[] pic;
    private byte[] saferpic;
    private String maintainer;
    private String reason;
    private String safer;
    private Integer belongto;
    private String project;
    private String action;
    private Integer partsRecord;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    @JsonFormat(pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime updatedAt;
}
