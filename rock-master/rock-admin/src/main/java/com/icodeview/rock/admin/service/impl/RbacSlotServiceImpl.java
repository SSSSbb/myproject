package com.icodeview.rock.admin.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.icodeview.rock.admin.dto.RbacSlotDto;
import com.icodeview.rock.admin.dto.RbacTypeDto;
import com.icodeview.rock.admin.mapper.RbacSlotMapper;
import com.icodeview.rock.admin.pojo.RbacSlot;
import com.icodeview.rock.admin.pojo.RbacType;
import com.icodeview.rock.admin.service.RbacSlotService;
import com.icodeview.rock.admin.vo.RbacSlotVo;
import com.icodeview.rock.admin.vo.RbacTypeVo;
import com.icodeview.rock.vo.PageResult;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

public class RbacSlotServiceImpl extends ServiceImpl<RbacSlotMapper, RbacSlot> implements RbacSlotService {
    public PageResult<RbacSlotVo> getIndex(Integer belongto , Long pageNum, Long pageSize) {
        Page<RbacSlot> rbacSlotPage = new Page<>(pageNum, pageSize);
        Page<RbacSlot> page = lambdaQuery()
                .eq(belongto != null , RbacSlot::getBelongto, belongto)
                .orderByDesc(RbacSlot::getId)
                .page(rbacSlotPage);
        List<RbacSlotVo> record = page.getRecords().stream()
                .map(rbacSot -> BeanUtil.copyProperties(rbacSot, RbacSlotVo.class))
                .collect(Collectors.toList());
        return PageResult.page(record,page);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void updateSlot(RbacSlotDto slotDto) {
        RbacSlot slot = BeanUtil.copyProperties(slotDto, RbacSlot.class);
        slot.setId(slotDto.getId());
        slot.setCode(slotDto.getCode());
        slot.setSlot(slotDto.getSlot());
        slot.setBelongto(slotDto.getBelongto());
        slot.setUpdatedAt(LocalDateTime.now());
        updateById(slot);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void createSlot(RbacSlotDto slotDto) {
        RbacSlot slot = BeanUtil.copyProperties(slotDto, RbacSlot.class);
        slot.setCode(slotDto.getCode());
        slot.setSlot(slotDto.getSlot());
        slot.setBelongto(slotDto.getBelongto());
        slot.setUpdatedAt(LocalDateTime.now());
        updateById(slot);
    }
}
