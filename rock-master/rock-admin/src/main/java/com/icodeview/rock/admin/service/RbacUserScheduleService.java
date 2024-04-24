package com.icodeview.rock.admin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.icodeview.rock.admin.dto.RbacUserScheduleDto;
import com.icodeview.rock.admin.pojo.RbacUserSchedule;

import java.util.List;

public interface RbacUserScheduleService extends IService<RbacUserSchedule> {
    List<RbacUserScheduleDto> getScheduleDTO();
    void generate(Integer belongto);
}
