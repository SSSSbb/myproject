package com.icodeview.rock.admin.vo;

import com.fasterxml.jackson.annotation.JsonFormat;
import lombok.Data;

import java.time.LocalDateTime;
@Data
public class RbacUserPreferencesVo {
    private Long id;
    private Long userid;
    private Integer noMoreThanTime;
    private Integer belongto;
    private Integer noWorkDay;


}
