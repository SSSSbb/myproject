package com.icodeview.rock.admin.service;

import com.baomidou.mybatisplus.extension.service.IService;
import com.icodeview.rock.admin.dto.RbacSlotDto;
import com.icodeview.rock.admin.pojo.RbacSlot;
import com.icodeview.rock.admin.vo.RbacSlotVo;
import com.icodeview.rock.vo.PageResult;

public interface RbacSlotService extends IService<RbacSlot> {
    PageResult<RbacSlotVo> getIndex(Integer belongto, Long pageNum, Long pageSize);
    void updateSlot(RbacSlotDto slotDto);
    void createSlot(RbacSlotDto slotDto);
}
