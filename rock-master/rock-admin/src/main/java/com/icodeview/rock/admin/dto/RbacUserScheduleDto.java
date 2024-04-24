package com.icodeview.rock.admin.dto;

import com.icodeview.rock.admin.pojo.RbacUser;
import com.icodeview.rock.admin.pojo.RbacUserSchedule;
import lombok.Data;
import lombok.EqualsAndHashCode;

@EqualsAndHashCode(callSuper = true)
@Data
public class RbacUserScheduleDto extends RbacUserSchedule {
    private RbacUser user;
}
