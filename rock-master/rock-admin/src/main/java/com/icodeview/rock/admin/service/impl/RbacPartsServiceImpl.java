package com.icodeview.rock.admin.service.impl;

import cn.hutool.core.bean.BeanUtil;
import cn.hutool.core.util.StrUtil;
import com.baomidou.mybatisplus.extension.plugins.pagination.Page;
import com.baomidou.mybatisplus.extension.service.impl.ServiceImpl;
import com.icodeview.rock.admin.dto.RbacPartsDto;
import com.icodeview.rock.admin.dto.RbacProfileDto;
import com.icodeview.rock.admin.mapper.RbacPartsMapper;
import com.icodeview.rock.admin.pojo.RbacParts;
import com.icodeview.rock.admin.pojo.RbacProfile;
import com.icodeview.rock.admin.service.RbacPartsService;
import com.icodeview.rock.admin.vo.RbacPartsVo;
import com.icodeview.rock.admin.vo.RbacProfileVo;
import com.icodeview.rock.vo.PageResult;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Isolation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.stream.Collectors;

@Service

public class RbacPartsServiceImpl extends ServiceImpl<RbacPartsMapper, RbacParts> implements RbacPartsService {
    @Override
    public PageResult<RbacPartsVo> getIndex(Integer id, String name, String sup, String man,Integer belongto, Long pageNum, Long pageSize) {
        Page<RbacParts> rbacPartsePage = new Page<>(pageNum, pageSize);
        Page<RbacParts> page = lambdaQuery()
                .eq(id != null , RbacParts::getId, id)
                .and(StrUtil.isNotBlank(name), q -> q.like(RbacParts::getName, "%" + name + "%"))
                .and(StrUtil.isNotBlank(sup), q -> q.like(RbacParts::getSup, "%" + sup + "%"))
                .and(StrUtil.isNotBlank(man), q -> q.like(RbacParts::getMan, "%" + man + "%"))
                .eq(belongto != null , RbacParts::getBelongto, belongto)
                .orderByDesc(RbacParts::getId)
                .page(rbacPartsePage);
        List<RbacPartsVo> record = page.getRecords().stream()
                .map(rbacParts -> BeanUtil.copyProperties(rbacParts, RbacPartsVo.class))
                .collect(Collectors.toList());
        return PageResult.page(record,page);
    }
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void updateParts(RbacPartsDto partsDto) {
        RbacParts parts = BeanUtil.copyProperties(partsDto, RbacParts.class);
        parts.setId(partsDto.getId());
        parts.setName(partsDto.getName());
        parts.setSpec(partsDto.getSpec());
        parts.setMan(partsDto.getMan());
        parts.setSup(partsDto.getSup());
        parts.setBuyAt(partsDto.getBuyAt());
        parts.setUsed(partsDto.getUsed());
        parts.setDiposed(partsDto.getDiposed());
        parts.setRemain(partsDto.getRemain());
        parts.setBelongto(partsDto.getBelongto());
        updateById(parts);
    }
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void PartsDipose(Integer id) {
        RbacParts currentParts = getById(id);
        if (currentParts != null) {
            currentParts.setDiposed(currentParts.getDiposed() + 1);
            currentParts.setUsed(currentParts.getUsed() - 1);
            updateById(currentParts);
        } else {
            System.out.println("error");
        }
    }
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void PartsUse(Integer id) {
        RbacParts currentParts = getById(id);
        System.out.println(id);
        currentParts.setUsed(currentParts.getUsed() + 1);
        currentParts.setRemain(currentParts.getRemain() - 1);
        System.out.println(currentParts);
        updateById(currentParts);
    }
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void createParts(RbacPartsDto partsDto) {
        RbacParts parts = BeanUtil.copyProperties(partsDto, RbacParts.class);
        parts.setName(partsDto.getName());
        parts.setSpec(partsDto.getSpec());
        parts.setMan(partsDto.getMan());
        parts.setSup(partsDto.getSup());
        parts.setBuyAt(partsDto.getBuyAt());
        parts.setModel(partsDto.getModel());
        parts.setUsed(partsDto.getUsed());
        parts.setRemain(partsDto.getRemain());
        parts.setDiposed(partsDto.getDiposed());
        parts.setBuyAt(partsDto.getBuyAt());
        parts.setBelongto(partsDto.getBelongto());
        save(parts);
    }
    @Override
    @Transactional(isolation = Isolation.READ_COMMITTED)
    public void deleteParts(Integer id) {
        RbacParts parts = getById(id);
        removeById(parts.getId());
    }
}
