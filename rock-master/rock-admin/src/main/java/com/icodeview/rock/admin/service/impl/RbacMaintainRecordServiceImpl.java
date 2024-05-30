package com.icodeview.rock.admin.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.icodeview.rock.admin.dto.RbacMaintainRecordDto;
import com.icodeview.rock.admin.dto.RbacProfileDto;
import com.icodeview.rock.admin.mapper.RbacMaintainRecordMapper;
import com.icodeview.rock.admin.pojo.RbacMaintainRecord;
import com.icodeview.rock.admin.pojo.RbacProfile;
import com.icodeview.rock.admin.service.RbacMaintainRecordService;
import com.icodeview.rock.admin.vo.RbacMaintainRecordVo;
import com.icodeview.rock.admin.vo.RbacProfileVo;
import com.icodeview.rock.vo.PageResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;
@Service
public class RbacMaintainRecordServiceImpl extends ServiceImpl<RbacMaintainRecordMapper, RbacMaintainRecord> implements RbacMaintainRecordService {
    @Override
    public PageResult<RbacMaintainRecordVo> getIndex(String action,Integer returned,Integer eid,String work,Integer id, String maintainer, Integer belongto, Integer partsRecord, String safer, Long pageNum, Long pageSize) {
        Page<RbacMaintainRecord> rbacMaintainRecordPage = new Page<>(pageNum, pageSize);
        Page<RbacMaintainRecord> page = lambdaQuery()
                .eq(id != null , RbacMaintainRecord::getId, id)
                .eq(eid != null , RbacMaintainRecord::getEid, eid)
                .eq(returned != null , RbacMaintainRecord::getReturned, returned)
                .and(StrUtil.isNotBlank(maintainer), q -> q.like(RbacMaintainRecord::getMaintainer, "%" + maintainer + "%"))
                .and(StrUtil.isNotBlank(action), q -> q.like(RbacMaintainRecord::getAction, "%" + action + "%"))
                .and(StrUtil.isNotBlank(work), q -> q.like(RbacMaintainRecord::getAction, "%" + work + "%"))
                .eq(belongto != null , RbacMaintainRecord::getBelongto, belongto)
                .eq(partsRecord != null , RbacMaintainRecord::getPartsRecord, partsRecord)
                .and(StrUtil.isNotBlank(safer), q -> q.like(RbacMaintainRecord::getSafer, "%" + safer + "%"))
                .eq(belongto != null , RbacMaintainRecord::getBelongto, belongto)
                .orderByDesc(RbacMaintainRecord::getId)
                .page(rbacMaintainRecordPage);
        List<RbacMaintainRecordVo> record = page.getRecords().stream()
                .map(rbacMaintainRecord -> BeanUtil.copyProperties(rbacMaintainRecord, RbacMaintainRecordVo.class))
                .collect(Collectors.toList());
        return PageResult.page(record,page);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public Integer createMaintainRecord(RbacMaintainRecordDto maintainRecordDto) {
        RbacMaintainRecord record = BeanUtil.copyProperties(maintainRecordDto, RbacMaintainRecord.class);
        record.setEnpSign(maintainRecordDto.getEnpSign());
        record.setEid(maintainRecordDto.getEid());
        record.setSafeSign(maintainRecordDto.getSafeSign());
        record.setMaintainer(maintainRecordDto.getMaintainer());
        record.setSafer(maintainRecordDto.getSafer());
        record.setBelongto(maintainRecordDto.getBelongto());
        record.setProject(maintainRecordDto.getProject());
        record.setPic(maintainRecordDto.getPic());
        record.setAction(maintainRecordDto.getAction());
        record.setReason(maintainRecordDto.getReason());
        record.setPartsRecord(maintainRecordDto.getPartsRecord());
        record.setReturned(maintainRecordDto.getReturned());
        record.setCreatedAt(LocalDateTime.now());
        record.setUpdatedAt(LocalDateTime.now());
        record.setSaferpic(maintainRecordDto.getSaferpic());
        System.out.println(record);
        save(record);
        return record.getId();
    }
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void updateMaintainRecord(RbacMaintainRecordDto maintainRecordDto) {
        RbacMaintainRecord record = BeanUtil.copyProperties(maintainRecordDto, RbacMaintainRecord.class);
        record.setId(maintainRecordDto.getId());
        record.setEid(maintainRecordDto.getEid());
        record.setEnpSign(maintainRecordDto.getEnpSign());
        record.setSafeSign(maintainRecordDto.getSafeSign());
        record.setSaferpic(maintainRecordDto.getSaferpic());
        record.setMaintainer(maintainRecordDto.getMaintainer());
        record.setSafer(maintainRecordDto.getSafer());
        record.setReason(maintainRecordDto.getReason());
        record.setBelongto(maintainRecordDto.getBelongto());
        record.setProject(maintainRecordDto.getProject());
        record.setReturned(maintainRecordDto.getReturned());
        record.setAction(maintainRecordDto.getAction());
        record.setPartsRecord(maintainRecordDto.getPartsRecord());
        record.setUpdatedAt(LocalDateTime.now());
        updateById(record);
    }

    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void deleteMaintainRecord(Integer id) {
        RbacMaintainRecord record = getById(id);
        removeById(record.getId());
    }

}
