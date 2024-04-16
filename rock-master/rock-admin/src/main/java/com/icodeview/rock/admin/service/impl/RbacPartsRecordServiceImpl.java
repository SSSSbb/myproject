package com.icodeview.rock.admin.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.icodeview.rock.admin.dto.RbacPartsRecordDto;
import com.icodeview.rock.admin.dto.RbacProfileDto;
import com.icodeview.rock.admin.mapper.RbacPartsRecordMapper;
import com.icodeview.rock.admin.pojo.RbacMan;
import com.icodeview.rock.admin.pojo.RbacPartsRecord;
import com.icodeview.rock.admin.pojo.RbacProfile;
import com.icodeview.rock.admin.pojo.RbacType;
import com.icodeview.rock.admin.service.RbacPartsRecordService;
import com.icodeview.rock.admin.vo.RbacPartsRecordVo;
import com.icodeview.rock.admin.vo.RbacTypeVo;
import com.icodeview.rock.vo.PageResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service

public class RbacPartsRecordServiceImpl extends ServiceImpl<RbacPartsRecordMapper, RbacPartsRecord> implements RbacPartsRecordService {
    @Override
    public PageResult<RbacPartsRecordVo> getIndex (Integer id,Integer recordId,Integer partId,String action,Integer replacePart,Integer belongto,Long pageNum, Long pageSize){
        Page<RbacPartsRecord> rbacPartsRecordPage = new Page<>(pageNum, pageSize);
        Page<RbacPartsRecord> page = lambdaQuery()
                .eq(id != null , RbacPartsRecord::getId, id)
                .eq(recordId != null , RbacPartsRecord::getRecordId, recordId)
                .eq(partId != null , RbacPartsRecord::getPartId, partId)
                .eq(belongto != null , RbacPartsRecord::getBelongto, belongto)
                .and(StrUtil.isNotBlank(action), q -> q.like(RbacPartsRecord::getAction, "%" + action + "%"))
                .eq(replacePart != null , RbacPartsRecord::getReplacePart, replacePart)
                .orderByDesc(RbacPartsRecord::getId)
                .page(rbacPartsRecordPage);
        List<RbacPartsRecordVo> record = page.getRecords().stream()
                .map(rbacPartsRecod -> BeanUtil.copyProperties(rbacPartsRecod, RbacPartsRecordVo.class))
                .collect(Collectors.toList());
        return PageResult.page(record,page);
    }
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void createPartsRecord(RbacPartsRecordDto partsRecordDto) {
        RbacPartsRecord record = BeanUtil.copyProperties(partsRecordDto, RbacPartsRecord.class);
        record.setRecordId(partsRecordDto.getRecordId());
        record.setPartId(partsRecordDto.getPartId());

        record.setAction(partsRecordDto.getAction());
        record.setReplacePart(partsRecordDto.getReplacePart());
        record.setExtrainfo(partsRecordDto.getExtrainfo());
        record.setBelongto(partsRecordDto.getBelongto());
        record.setCreatedAt(LocalDateTime.now());
        record.setUpdatedAt(LocalDateTime.now());
        save(record);
    }
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void deletePartsRecord(Integer id) {
        RbacPartsRecord pro = getById(id);
        removeById(pro.getId());
    }
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void updateRartsRecord(RbacPartsRecordDto partsRecordDto) {
        RbacPartsRecord record = BeanUtil.copyProperties(partsRecordDto, RbacPartsRecord.class);
        record.setId(partsRecordDto.getId());
        record.setRecordId(partsRecordDto.getRecordId());
        record.setPartId(partsRecordDto.getPartId());

        record.setAction(partsRecordDto.getAction());
        record.setReplacePart(partsRecordDto.getReplacePart());
        record.setExtrainfo(partsRecordDto.getExtrainfo());
        record.setBelongto(partsRecordDto.getBelongto());
        record.setUpdatedAt(LocalDateTime.now());
        updateById(record);
    }
}
