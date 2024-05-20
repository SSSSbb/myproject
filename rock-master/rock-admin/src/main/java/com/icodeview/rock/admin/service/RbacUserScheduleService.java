package com.icodeview.rock.admin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.icodeview.rock.admin.dto.RbacUserScheduleDto;
import com.icodeview.rock.admin.pojo.RbacUserSchedule;
import com.icodeview.rock.admin.vo.RbacUserPreferencesVo;
import com.icodeview.rock.admin.vo.RbacUserScheduleVo;
import com.icodeview.rock.vo.PageResult;

import java.time.LocalDateTime;
import java.util.List;

public interface RbacUserScheduleService extends IService<RbacUserSchedule> {
    List<RbacUserScheduleDto> getScheduleDTO();
    List<RbacUserScheduleVo> getIndex(Integer id, Integer userid, Integer belongto);
    void updateSchedule(RbacUserScheduleDto dto);
    void generate(Integer belongto);
}
