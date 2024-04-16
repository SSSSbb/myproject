package com.icodeview.rock.admin.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.icodeview.rock.admin.dto.RbacPartsDto;
import com.icodeview.rock.admin.dto.RbacPartsProfileDto;
import com.icodeview.rock.admin.mapper.RbacPartsProfileMapper;
import com.icodeview.rock.admin.pojo.RbacParts;
import com.icodeview.rock.admin.pojo.RbacPartsProfile;
import com.icodeview.rock.admin.pojo.RbacProfile;
import com.icodeview.rock.admin.service.RbacPartsProfileService;
import com.icodeview.rock.admin.service.RbacPartsService;
import com.icodeview.rock.admin.vo.RbacProfileVo;
import com.icodeview.rock.admin.vo.partsProfileVo;
import com.icodeview.rock.vo.PageResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service

public class RbacPartsProfileImpl extends ServiceImpl<RbacPartsProfileMapper, RbacPartsProfile> implements RbacPartsProfileService {
    @Override
    public PageResult<partsProfileVo> getIndex(Integer id, Integer partsid,String name, String status, Integer which, String maintaintype, Integer belongto, Long pageNum, Long pageSize) {
        Page<RbacPartsProfile> rbacPartsProfilePage = new Page<>(pageNum, pageSize);
        Page<RbacPartsProfile> page = lambdaQuery()
                .eq(id != null , RbacPartsProfile::getId, id)
                .and(StrUtil.isNotBlank(name), q -> q.like(RbacPartsProfile::getName, "%" + name + "%"))
                .and(StrUtil.isNotBlank(status), q -> q.like(RbacPartsProfile::getStatus, "%" + status + "%"))
                .and(StrUtil.isNotBlank(maintaintype), q -> q.like(RbacPartsProfile::getMaintaintype, "%" + maintaintype + "%"))
                .eq(belongto != null , RbacPartsProfile::getBelongto, belongto)
                .eq(partsid != null , RbacPartsProfile::getPartsid, partsid)
                .eq(which != null , RbacPartsProfile::getWhich, which)
                .orderByDesc(RbacPartsProfile::getId)
                .page(rbacPartsProfilePage);
        List<partsProfileVo> record = page.getRecords().stream()
                .map(rbacPartsProfile -> BeanUtil.copyProperties(rbacPartsProfile, partsProfileVo.class))
                .collect(Collectors.toList());
        return PageResult.page(record,page);
    }
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void createPartsProfile(RbacPartsProfileDto partsProfileDto) {
        RbacPartsProfile partsprofile = BeanUtil.copyProperties(partsProfileDto, RbacPartsProfile.class);
        partsprofile.setName(partsProfileDto.getName());
        partsprofile.setPartsid(partsProfileDto.getPartsid());
        partsprofile.setMaintaintype(partsProfileDto.getMaintaintype());
        partsprofile.setStatus(partsProfileDto.getStatus());
        partsprofile.setWhich(partsProfileDto.getWhich());
        partsprofile.setLastMaintain(partsProfileDto.getLastMaintain());
        partsprofile.setLastRepair(partsProfileDto.getLastRepair());
        partsprofile.setCreateAt(partsProfileDto.getCreateAt());
        partsprofile.setUpdateAt(partsProfileDto.getUpdateAt());
        partsprofile.setDiposedAt(partsProfileDto.getDiposedAt());
        partsprofile.setCreateAt(LocalDateTime.now());
        partsprofile.setUpdateAt(LocalDateTime.now());
        partsprofile.setBelongto(partsProfileDto.getBelongto());
        save(partsprofile);
    }
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void deletePartsProfile(Integer id) {
        RbacPartsProfile partsprofile = getById(id);
        partsprofile.setDiposedAt(LocalDateTime.now());
        updateById(partsprofile);
    }
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void updatePartsProfile(RbacPartsProfileDto partsProfileDto) {
        RbacPartsProfile partsprofile = BeanUtil.copyProperties(partsProfileDto, RbacPartsProfile.class);
        partsprofile.setId(partsProfileDto.getId());
        partsprofile.setName(partsProfileDto.getName());
        partsprofile.setPartsid(partsProfileDto.getPartsid());
        partsprofile.setMaintaintype(partsProfileDto.getMaintaintype());
        partsprofile.setStatus(partsProfileDto.getStatus());
        partsprofile.setWhich(partsProfileDto.getWhich());
        partsprofile.setLastMaintain(partsProfileDto.getLastMaintain());
        partsprofile.setLastRepair(partsProfileDto.getLastRepair());
        partsprofile.setUpdateAt(partsProfileDto.getUpdateAt());
        partsprofile.setDiposedAt(partsProfileDto.getDiposedAt());
        partsprofile.setUpdateAt(LocalDateTime.now());
        partsprofile.setBelongto(partsProfileDto.getBelongto());
        updateById(partsprofile);
    }
}
